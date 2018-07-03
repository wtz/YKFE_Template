/**
 * @ 文字左右上下无缝滚动
 * @author wutianzhi
 * @version
 */

(function (global, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory);
    } else {
        global.TextMarquee = factory();
    }
}(this, function () {

	function TextMarquee(el, options){
           var defaults = {
                direction:'up',  //right
                liheight:30, //单行的高度
                liwidth:140,
                speed:50, // 滚动的速度
                isAuto:true,
                delay:1000 // 延迟滚动
            };


            this.el = el;
            this.params = $.extend(defaults, options || {});   
             
            
                
            if(this.params.direction === 'left'){
                this.el.find('ul').get(0).innerHTML += this.el.find('ul').get(0).innerHTML;
                var len = this.el.find('li')
                var w = this.el.find('ul li').width()+500
                console.log(w,len.length)
                this.el.find('ul').width(w*len.length+'px')
            }else{
                this.el.get(0).innerHTML += this.el.get(0).innerHTML;


            }

            this.init();
    }   

    TextMarquee.prototype = {
        init: function(){
            var _this = this;
            setTimeout(function(){
                _this.startMarquee()
            }, this.params.delay)
        },
        startMarquee: function(){
           var _this = this;
           
           this.autoScroll = setInterval(function(){
            
            _this.params.direction === 'up' ? _this.scrollUp() : _this.scrollLeft() ;
           }, this.params.speed);
           
          this.params.direction === 'up' ? this.el.get(0).scrollTop++ : this.el.get(0).scrollLeft++ ;
        },

        scrollUp: function(){
            var _this = this;
            if (this.el.get(0).scrollTop % this.params.liheight == 0) {
                clearInterval(this.autoScroll);
                setTimeout(function(){
                    _this.startMarquee()
                }, this.params.delay);
            } else {
                this.el.get(0).scrollTop++;
                if (this.el.get(0).scrollTop >= this.el.get(0).scrollHeight / 2) {
                    this.el.get(0).scrollTop = 0;
                }
            }
        },
        
        scrollLeft: function(){
            var _this = this;
            // if (this.el.get(0).scrollLeft % this.params.liwidth == 0) {
            //     clearInterval(this.autoScroll);
            //     setTimeout(function(){
            //         _this.startMarquee()
            //     }, this.params.delay);
            // } else {
                this.el.get(0).scrollLeft++;
                if (this.el.get(0).scrollLeft >= this.el.get(0).scrollWidth / 2) {
                    this.el.get(0).scrollLeft = 0;
                }
            // }
        },




    }    


    $.fn.TextMarquee = function(options){
         this.each(function(){
            var $this = $(this);
            var t = new TextMarquee($this,options)
            $this.data('TextMarquee',t) 
         })
    }


    return TextMarquee;


	
}));
