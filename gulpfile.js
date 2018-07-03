/*glup4 pc端工作流
 *by wutianzhi
 */
var path = require("path");
var fs = require("fs")
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var lazysprite = require('postcss-lazysprite'); //css sprites 
var sourcemaps = require('gulp-sourcemaps');
var precss = require('precss'); //PreCSS预处理器
var assets = require('postcss-assets'); // 处理图片和css
var autoprefixer = require('autoprefixer');
var cssImport = require("postcss-import")
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
// var handlebars = require('gulp-compile-handlebars');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create(); //浏览器自动刷新
var del = require('del');

var cssnano = require('cssnano');
var uglify = require("gulp-uglify");
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var htmlmin = require('gulp-htmlmin');

var replace = require('gulp-replace');
var fileinclude = require('gulp-file-include');

var minimist = require('minimist'); //命令行解析
var rename = require('gulp-rename');
var glob = require('glob');


// 判断是否全是前后端分离的项目
var isAjaxProject = true;


//通过gulp --pc | --h5 来区分是PC还是H5

var knownOptions = {
  string: ['env','type'],  // 本次编译的环境，开发模式还是生产 // 本次编译的类型，打包成PC端页面，还是H5页面	 
  default: { 
  	env: process.env.NODE_ENV || 'dev',
  	type: 'pc'
  }
};


var args = minimist(process.argv.slice(2), knownOptions);


// .pipe(gulpif(options.env === 'production', uglify())) // 仅在生产环境时候进行压缩
// gulp scripts --env development

// npm run pc_dev    gulp --env=dev --type=pc  		or  gulp --type=pc
// npm run pc_pro    gulp pro --env=pro --type=pc   or  gulp buildPhp --type=pc
// npm run h5_dev    gulp --env=dev --type=h5       or  gulp --type=h5
// npm run h5_pro    gulp pro --env=pro --type=h5   or  gulp buildPhp --type=h5






/***-------config--------**/ 
var baseUrl = './'




// development
gulp.task('default',gulp.parallel(watchPostCSSFileChange,gulp.series(clean,gulp.series(compilePostCss,openDevServer))))
console.log(args.env,args.type)

// 开发|线上 区分不同的目录
var baseDir = baseUrl+args.type+'/'

function clean(){
	return del(baseDir+'css');
}


// 监控post css文件变化
function watchPostCSSFileChange(){
	return gulp.watch(baseDir+'pcss/**/*.css',compilePostCss)
}


function compilePostCss(){
	return gulp.src(baseDir+'pcss/**/*.css')
    .pipe(postcss([
        precss(),
        lazysprite({
		    imagePath: baseDir+'img/slice', //雪碧图小图所在目录；
		    stylesheetInput: baseDir+'pcss', //CSS 文件所在的目录，一般与gulp.src的路径相关；
		    stylesheetRelative: 'dist/css', //为了在生成的CSS 中构造相对路径而引入，一般与gulp.dest的路径相关；
		    spritePath: baseDir+'img/', //生成的雪碧图放置的目录
		    smartUpdate: true, //是否启用智能更新机制: create a hash for sprites files 
		    nameSpace: 'icon-'
		  }),
        assets({
	      loadPaths: [baseDir+'img/'],
	      cachebuster: true, //图片时间戳
	    })
    ]))
    .pipe(gulp.dest(baseDir+'css'));
}



function openDevServer() {
	nodemon({
	    script: 'http.js',
	    ignore: ["gulpfile.js", "node_modules/", "public/**/*.*"],
	    env: {'NODE_ENV': 'development', type: args.type}
	  }).on('start', function() {
	    browserSync.init({
	      proxy: 'http://localhost:3000', //代理本地3000端口server
	      baseDir: "./",
	      // files: ["public/**/*.*", "views/**", "routes/**"],
	      port: 8080
	    }, function() {
	      console.log("browser refreshed.load");
	    });

	    gulp.watch([baseDir+"*.html", baseDir+"css/**/*.css",baseDir+"js/**/*.js",baseDir+"img/*"]).on("change", browserSync.reload);
	  });
}




// product
// 将版本号自动打到php文件中，不用每次手动改
// resources/views/home
// 
gulp.task('pro', gulp.series(delDist,gulp.series(gulp.parallel(copyImg,copyjsLibs,cssMin,gulp.series(concatUglify,htmlMin)),gulp.series(gulp.parallel(cssVersion,jsVersion),htmlVersion))))





function delDist(){
	return del(baseDir+'dist');
}




//****提取合并js 并压缩合并的js文件，依赖htmlMin****
// 需要解析HTML中的img标签路劲，退换成dist路径,, img src="src/img/..." 需要将src/退换成dist/
function concatUglify(){
	return gulp.src(baseDir+'*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify({
		        ie8:true     
		    })))
        .pipe(gulp.dest(baseDir+'dist'))
}



// 如果是全前后端分离的项目，则压缩html,否则不压缩html

function htmlMin(){
	return gulp.src(baseDir+'dist/*.html')
		// .pipe(replace('img', 'img'))   // 将html中的src路径退换成dist
        // .pipe(gulpif(isAjaxProject,htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest(baseDir+'dist'));	
}




//****copyImg、copyjsLisb、cssMin 这三个任务可以并行，并且可以和 压缩合并js 任务并行****
function copyImg(){
	return gulp.src(baseDir+'img/*')
		   .pipe(gulp.dest(baseDir+'dist/img')) 	
}

function copyjsLibs(){
	return gulp.src(baseDir+'js/lib/*.js')
		   .pipe(gulp.dest(baseDir+'dist/js/lib/')) 		
}


function cssMin(){
	return gulp.src(baseDir+'css/pages/*.css')
		   .pipe(postcss([
		   		cssnano({
		   			// preset: 'default'
		   		})
		   	]))
		   .pipe(gulp.dest(baseDir+'dist/css/pages'))
}



//****静态资源版本号处理****
function cssVersion(){
	return gulp.src(baseDir+'dist/css/pages/*.css')
	    .pipe(rev())
	    .pipe(gulp.dest(baseDir+'dist/css/pages'))
	    .pipe(rev.manifest())
	    .pipe(gulp.dest(baseDir+'dist/css/pages'));
}


function jsVersion(){
	return gulp.src([baseDir+'dist/js/pages/*.js'])
	    .pipe(rev()) //给文件添加hash编码  
	    .pipe(gulp.dest(baseDir+'dist/js/pages'))
	    .pipe(rev.manifest()) //生成rev-mainfest.json文件作为记录  
	    .pipe(gulp.dest(baseDir+'dist/js/pages'));
}

// 依赖isHasTplFile任何
// 在该项目前先判断 resources/views下面有没有执行该命令时候的目录和对应的文件，如果没有的话则先自动生成，
// 否则就不生成，直接添加版本号即可
// 
// 该任务依赖cssVersin 和 jsVersion
// 如果是全ajax前后端分离的项目，和 不是前后端分离的项目
function htmlVersion(){
	return gulp.src([baseDir+'dist/**/*.json', baseDir+'dist/*.html'])
	    .pipe(revCollector())
	    .pipe(gulp.dest(baseDir+'dist'))
}



// 生成php模板文件，每一次有添加文件或者需要执行以下该命令（第一次执行该命令会自动根据html生成php模板文件） 
gulp.task('buildPhp',gulp.series(compilePostCss,'pro',handlePhpVersion))


// 自动生成模板文件
// 这个依赖 dist html 任务。
function handlePhpVersion(){
		var distHtmlPath = path.resolve(__dirname, args.type+'/dist/*.html');
		var strPath = path.resolve(__dirname, '../resources/views/'+args.type);

		// 存在目录
		if(fsExistsSync(strPath)){
			console.log('目录存在:然后有静态资源变动，改变版本号，php 模板内容不变。')

			// dist 目录的和该目录文件做对比，如果dist目录有，该目录没有则添加，
			// 该目录有，dist 目录没有，不处理。（建议不要手动添加带嵌入css和js的代码）
			// 
			// 如果 html中有的文件而 php 模板文件中不存在。则自动自动添加。按理说应该有html-php
			// 

			 var files1 = glob.sync(distHtmlPath);
		 	 var files2 = glob.sync(strPath+'/*.blade.php');
		 	 var file2Arr = [];


		 	 files2.map(function(f2){
		 			var f2 = f2.replace('.blade.php','');
		    		var index2 = f2.lastIndexOf('/');
			    	var fileName2 = f2.substring(index2+1);
		    		file2Arr.push(fileName2);
		    })



		 	 // 只需要循环file1里面的模板文件，判断 views下面有没有，有不管，没有就添加即可
		 	 files1.map(function(f1){
		 	 	var f1 = f1.replace('.html','');
		    	var index = f1.lastIndexOf('/');
		    	var fileName = f1.substring(index+1);
		    	
		    	// console.log('excute1：',file2Arr.includes(fileName))
		    	if(!file2Arr.includes(fileName)){
			 		 return gulp.src(path.resolve(__dirname, args.type+'/dist/'+fileName+'.html'))
		    			  	.pipe(rename(function (path) {
							    path.basename += ".blade";
							    path.extname = ".php";
							  }))
			                .pipe(gulp.dest(strPath));
		    	}
		    });

			// var data = fs.readFileSync('pc/dist/js/pages/rev-manifest.json', 'utf8');
			// console.log(data);


			// 注意，revCollector 只能是对没有版本号的文件生成版本号，index.js ---index.23423.js 
			// 如果本身存在版本号，则无法实现，需要将php中带有版本号的去掉，然后在生成版本号。
			// 解决方案 replaceReved:true 即可

			return gulp.src([baseDir+'dist/**/**/*.json', strPath+'/*.php'])
			// return gulp.src(['pc/dist/js/pages/rev-manifest.json', '../resources/views/pc/index.blade.php'])
			    .pipe(revCollector({
			    	replaceReved:true
			    }))
			    .pipe(gulp.dest(strPath))


		 	// gulp所有的任务必须返回流。 注意这里必须返回一个流，否则会报错 
		 	// return new Promise(function(resolve, reject) {
			 //    console.log("HTTP Server Started");
			 //    resolve();
			 //  });

		}else{

			console.log('目录不存在')
			// 不存在，表示第一次，自动创建目录，并生成php文件| 最好能自动分开header、fooer、siderbar 文件
			return gulp.src(path.resolve(__dirname, args.type+'/dist/*.html'))
				.pipe(rename(function (path) {
				    path.basename += ".blade";
				    path.extname = ".php";
				  }))
				.pipe(gulp.dest(strPath))

		}


}


// 判断目录是否存在
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}




