/**
 * @DateTime.js
 * @author wutianzhi
 * @version
 */

(function (global, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory);
    } else {
        global.DateTime = factory();
    }
}(this, function (require, exports, module) {
	
	var utils = {
		/**
		 * 格式化数字，不足两位前面补0
		 * @name _CAL#formatNum
		 * @param {number} num 要格式化的数字	 
		 * @function
		 * @return string
		 */	
		formatNum: function(num) {
			return num.toString().replace(/^(\d)$/, "0$1")	
		},

		_dateName: {
			"today":"\u4eca\u5929",
			"yuandan":"\u5143\u65e6",
			"chuxi":"\u9664\u5915",
			"chunjie":"\u6625\u8282",
			"yuanxiao":"\u5143\u5bb5\u8282",
			"qingming":"\u6e05\u660e",
			"wuyi":"\u52b3\u52a8\u8282",
			"duanwu":"\u7aef\u5348\u8282",
			"zhongqiu":"\u4e2d\u79cb\u8282",
			"guoqing":"\u56fd\u5e86\u8282"
		},


	}	




	/**
	 * @type  'default' 为默认渲染当前的月份信息 || 'select' 头部为select框，适合年限较长的 || 'arr' 头部有向左右的切换
	 * @param {[type]} el      [description]
	 * @param {[type]} options [description]
	 */
	function DateTime(el, options){

		// 默认参数
        var defaults = {
            value: '',
            isHeadSelect:false,
            trigger: ['change'],
            onShow: $.noop,
            onHide: $.noop
        };

        this.el = el;
        this.params = $.extend({},defaults, options||{})

        this.tpl = [
			"<div class=\"cal-container\">",
				"<dl>",
					"<dt class=\"date\"></dt>",
					"<dt><strong>\u65e5</strong></dt>",
					"<dt>\u4e00</dt>",
					"<dt>\u4e8c</dt>",
					"<dt>\u4e09</dt>",
					"<dt>\u56db</dt>",
					"<dt>\u4e94</dt>",
					"<dt><strong>\u516d</string></dt>",
					"<dd></dd>",
				"</dl>",
			"</div>"
		];

		$('body').append(this.tpl.join(''))

		
		this.uiType = this.el.attr('data-uidatetype')





        this.init();
        this.createHtml()

	}	

	DateTime.prototype = {
		init: function(){

		},

		createHtml: function(){

		}
	}




	$.fn.DateTime = function(options) {
		return $(this).each(function() {
			if (!$(this).data('DateTime')) {
				$(this).data('DateTime', new DateTime($(this), options));
			}
		});
	};

	return DateTime;
}));
