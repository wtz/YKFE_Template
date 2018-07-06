/**
 * 图片序列帧
 * *
 */

(function (global, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory);
    } else {
        global.ImageSequence = factory();
    }
}(this, function (require) {
		
	function ImageSequence(el,options){
		var defaults = {
			imgUrl:'',
			imgArr:[],
			callback:$.noop
		}

		this.params = $.extend({},defaults, options || {})
		this.el = el;
		this.el.append('<span class="ui-imgsequ-loading" data-percent="0"></span>')
		this.loadingEle = this.el.find('.ui-imgsequ-loading');

		this.maxLength = this.params.indexRange[1] - this.params.indexRange[0] + 1;
		this.store = {
		    length: 0    
		};

		this.preloadImgs()


	} 

	ImageSequence.prototype = {
		loading: function(){

		},

		preloadImgs: function(){
			var _this = this;
			for ( var start = this.params.indexRange[0]; start <= this.params.indexRange[1]; start++) {
			    (function (index) {
			        var img = new Image();
			        img.onload = function () {
			            _this.store.length++;
			            // 存储预加载的图片对象
			            _this.store[index] = this;
			            _this.play();
			        };
			        img.onerror = function () {
			            _this.store.length++;    
			            _this.play();
			        };
			        img.src = _this.params.urlRoot + index + '.jpg';
			    })(start);    
			}
		},

		play: function(){
			var _this = this;
			 // loading进度

			 
		    var percent = Math.round(100 * this.store.length / this.maxLength);
		    this.el.get(0).setAttribute('data-percent',
