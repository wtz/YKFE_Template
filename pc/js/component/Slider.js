/**
 * @Slider.js
 * @author wutianzhi
 * @version
 */

(function(global, factory) {
  if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(factory);
  } else {
    global.Slider = factory();
  }
}(this, function() {


  


  function Slider(el,options) {
    var me = this;

    var defaults = {
      prev: ".ui-slider-prev",
      next: ".ui-slider-next",
      links: ".ui-slider-items",
      speed: 5000,
      isShowBtn: !0,
      isAutoDot: !0,
      nobg: !0,
      bar: '.ui-slider-flash_bar',
      type: 'opacity'
    };

    console.log(el)

    this.setting = $.extend(defaults, options || {});
    this.links = el.find(this.setting.links);
    this.bar = el.find(this.setting.bar);
    this.isAutoDot = this.setting.isAutoDot;
    this.imgloading = el.find(".ui-slider-loading");
    this.preBtn = el.find(this.setting.prev);
    this.nextBtn = el.find(this.setting.next);

    function resizeBanner(bar) {
      var barWidth = $('body').width() - me.bar.width();
      me.bar.css({ left: barWidth / 2 })
    }

    $(window).bind('resize', function() {
      resizeBanner(me.bar)
    })


    this.links.each(function() {
      var e = $(this),
        i = e.find("img");
      e.css({
        "background-image": "url(" + i.attr("src") + ")",
        "background-color": me.links.eq(0).attr("name")
      })

      i.hide();
      me.bar.append('<div class=".ui-slider-no" />');

    });

    resizeBanner(me.bar)

    this.buttons = me.bar.find('div');


    this.imgloading.hide();

    // 默认索引0
    me.currentIndex = 0;
    me.currentItem = this.buttons.first();

    console.log('sss:',me.currentItem)

   	this.init();

  }

  Slider.prototype = {
  	init: function() {
        var _this = this;
        this.invoke(0)
        // 自动播放
        if (this.isAutoDot) {
          // bar.css('marginLeft','-200px')
          this.autoPlay();
        }

        this.buttons.bind('click', function() {
          _this.stopAuto();
          _this.invoke($(this).index());
        })

        this.buttons.bind('mouseout', function() {
          _this.autoPlay();
        })

        this.preBtn.bind('click', function() {
          _this.stopAuto();
          _this.preItem()
        })

        this.nextBtn.bind('click', function() {
          _this.stopAuto();
          _this.nextItem()
        })


      },

      autoPlay: function() {
        var _this = this;
        this.stopAuto();
        this.interval = setInterval(function() {
          _this.nextItem();
        }, this.setting.speed)

      },

      stopAuto: function() {
        clearInterval(this.interval)
      },

      preItem: function() {
        var preItemIndex = this.currentItem.index() - 1;
        if (preItemIndex <= 0) preItemIndex = 0
        this.invoke(preItemIndex);
      },

      nextItem: function() {
        var nextItemIndex = this.currentItem.index() + 1;
        if (nextItemIndex >= this.buttons.length) nextItemIndex = 0
        this.invoke(nextItemIndex);
      },

      invoke: function(n) {
      	console.log(n)
        this.currentItem = this.buttons.eq(n);
        this.currentItem.removeClass('ui-slider-no').addClass('ui-slider-dq').siblings().removeClass('ui-slider-dq').addClass('ui-slider-no');
        if (this.setting.type == 'opacity') {
          this.links.css({ "display": "none", "opacity": 0 });
          this.links.eq(n).css('display', 'block');
          this.links.eq(n).animate({ 'opacity': 1 }, 'slow');
        }

      }

  }


	$.fn.Slider = function(options){
  		this.each(function(){
  				var $this = $(this);
                var s = new Slider($this,options);
                $this.data('Slider',s);
  		})
  	}


  return Slider;


}));
