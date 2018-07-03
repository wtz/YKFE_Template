/**
 * @Tab.js
 * @author wutianzhi
 * @version
 */

(function (global, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory);
    } else {
        global.Tab = factory();
    }
}(this, function () {

	var getQueryByName = function(name) {
      var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
      if (result == null || result.length < 1) {
        return "";
      }
      return result[1];
    }




	 // 根据属性获得对应的元素
    $.fn.tab = function(options) {
        if (!$(this).data('tab')) {
            $(this).data('tab', new Tab($(this), options));
        }
    };

	var Tab = function(el, options){
		el = $(el);
        if (el.length == 0) return;
        
        options = options || {};
        
        var defaults = {
            eventType: 'click',
            curClass:'checked',
            index:0,
            callback: $.noop
        };
        
        var params = $.extend({}, defaults, options);

        var attrInfo = el.attr('data-relTab');
        var getTargetTab = getQueryByName('targetTab');

        var tmp = [];
        var queryIndex = null;

        el.each(function(index) {
        	var tabRel = $(this).attr('data-relTab')	
        	if(tabRel){
        		tmp.push(tabRel)
        	}

        	if(getTargetTab && getTargetTab == tabRel){
        		queryIndex = index;
        	}
        })


        // if(params.index){
        // 	queryIndex = params.index
        // }


        // 通过地址栏中定位tab
        if(getTargetTab && el.length == tmp.length){
        	el.eq(queryIndex).addClass(params.curClass).siblings().removeClass(params.curClass)
        	el.parents('.tabView').find('.ui-tab-content').eq(queryIndex).addClass(params.curClass).siblings('.ui-tab-content').removeClass(params.curClass);
        	params.callback.call(this)
        	
        }

        el.on(params.eventType, function(event) {
        	var index = $(this).index();
        	$(this).addClass(params.curClass)
        	$(this).siblings('.ui-tab-tab').removeClass(params.curClass)
        	$(this).parents('.tabView').find('.ui-tab-content').eq(index).addClass(params.curClass).siblings('.ui-tab-content').removeClass(params.curClass);
        	params.callback.call(this)
        })





        // 默认就来一发
        // $(function() {
        //     el.eq(params.index).trigger(params.eventType);
        // });

        // 暴露的属性或方法，供外部调用
        this.el = {
           tab: el,
           tabIndex: function(index){
           	// 外部主动触发tab
           	el.eq(index).addClass(params.curClass).siblings().removeClass(params.curClass)
        	el.parents('.tabView').find('.ui-tab-content').eq(index).addClass(params.curClass).siblings('.ui-tab-content').removeClass(params.curClass);
        	params.callback.call(this)
           }
        };

        this.params = params;

	}
	
	return Tab;
}));
