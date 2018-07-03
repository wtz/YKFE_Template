/**
 * PC 端 游卡通行证组件
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
		    this.el.get(0).setAttribute('data-percent', percent);
		    this.el.get(0).style.backgroundSize = percent + '% 100%';
		    // 全部加载完毕，无论成功还是失败
		    if (percent == 100) {
		        var index = this.params.indexRange[0];
		        this.el.get(0).innerHTML = '';
		        // 依次append图片对象
		        var step = function () {
		            if (_this.store[index - 1]) {
		                // _this.el.get(0).removeChild(_this.store[index - 1]);
		                _this.el.empty()
		            }    
		            _this.el.get(0).append(_this.store[index]);
		            // 序列增加
		            index++;
		            // 如果超过最大限制
		            if (index <= _this.params.indexRange[1]) {
		                setTimeout(step, 42);
		            } else {
		                // 本段播放结束回调
		                typeof _this.params.callback == 'function' && _this.params.callback.call(_this,_this)
		                
		            }
		        };
		        // 等100%动画结束后执行播放
		        setTimeout(step, 100);
		    }
		}
	}	

	$.fn.ImageSequence = function(options){
		return $(this).each(function(){
			if (!$(this).data('ImageSequence')) {
	            $(this).data('ImageSequence', new ImageSequence($(this), options));
	        }
		})
	}


	return ImageSequence;

}));



