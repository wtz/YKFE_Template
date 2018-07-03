/**
 * wutianzhi
 */

(function (global, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory);
    } else {
        global.Dialog = factory();
    }
}(this, function (require) {


	// jquery语法
    $.dialog = function (options) {
       return new Dialog(options);
    };

    var Dialog = function(options) {
		var defaults = {
			title: '',
			content: '',
			width: 'auto',
			buttons: [],
			isMaskClick:false,
			onShow: $.noop,
			onHide: $.noop,
			onOkFn:$.noop,
			onCanFn:$.noop
		};

		this.params = $.extend({}, defaults, options || {});
		

		var _this = this;

		this.el = {}
		this.el.mask = $('<div class="ui-dialog-mask"></div>')
		this.el.container = $('<div class="ui-dialog-container"></div>')

		this.el.dialog = $('<div class="ui-dialog"></div>')
		this.el.closeBtn = $('<a href="javascript:" class="ui-dialog-close"></a>')
		this.el.title = $('<div class="ui-dialog-title"></div>').html(this.params.title)
		this.el.body = $('<div class="ui-dialog-body"></div>')
		this.el.footer = $('<div class="ui-dialog-footer"></div>')

		
		this.el.mask.appendTo(document.body)
		this.el.container.append(this.el.dialog)
		this.el.dialog.append(this.el.closeBtn)
		this.el.dialog.append(this.el.title)
		this.el.dialog.append(this.el.body)
		this.el.dialog.append(this.el.footer)
		this.el.container.appendTo(document.body)
		

		if(typeof this.params.content == 'object'){
			this.el.body.html(this.params.content);
			this.el.footer.html('<a href="javascript:" class="ui-button ui-button-success">确定</a>');
			this.show();
		}



		this.el.closeBtn.on('click',function(){
			_this.hide();
		})

		this.el.footer.on('click',function(e){
			if($(e.target).attr('data-type')){
				if($(e.target).attr('data-type') == 'ok'){
					typeof _this.params.onOkFn == 'function' && _this.params.onOkFn.call(this)
				}else{
					typeof _this.params.onCanFn == 'function' && _this.params.onCanFn.call(this)
				}
			}
			_this.hide();
			
		})



		// if(this.params.isMaskClick == true){
		// 	this.el.mask.on('click',function(){
		// 		console.log('excute')
		// 		_this.hide();
		// 	})
		// } 



		
	};

	/**
	 * 无标题，只有一个按钮
	 * @return {[type]} [description]
	 */
	Dialog.prototype.alert = function(str){
		var btnVal = this.params.buttons.length == 0 ? '确定' : this.params.buttons[0].value
		this.el.body.html(str);
		this.el.footer.html('<a href="javascript:" class="ui-button ui-button-success">'+btnVal+'</a>');
		this.show()
		
	}


	Dialog.prototype.confirm = function(str){
		
		if(this.params.buttons.length == 0){
			var okBtn = '确定'
			var resetBtn = '取消'
		}else{
			var okBtn = this.params.buttons[0].value
			var resetBtn = this.params.buttons[1].value
		}
		
		this.el.body.html(str);
		this.el.footer.html('<a href="javascript:" class="ui-button ui-button-success" data-type="ok">'+okBtn+'</a><a href="javascript:" class="ui-button" data-type="reset">'+resetBtn+'</a>');
		this.show()
	}


	Dialog.prototype.ajax = function(opt){
		var _this = this;
		opt = opt || {}
		$.get(opt.url,function(res){
			typeof opt.callback == 'function' && opt.callback.call(this,res)
		})
		
	}

	Dialog.prototype.show = function(){
		console.log($(this.el.mask).length)
		if(!this.el.mask.length){
			this.el.mask.appendTo(document.body)
		}else{
			this.el.mask.show();
		}

		if(!this.el.container.length){
			this.el.container.appendTo(document.body)
		}else{
			this.el.container.show();
		}

		typeof this.params.onShow == 'function' && this.params.onShow.call(this)  
	}

	Dialog.prototype.hide = function(){
		this.el.mask.hide();
		this.el.container.hide();
		typeof this.params.onHide == 'function' && this.params.onHide.call(this)
	}

	
	
	
	return Dialog;
}));

