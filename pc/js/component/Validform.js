/*!
 * 验证是否为邮政编码；
 * created by wutianzhi	
 * 
 */

(function (global, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory);
    } else {
        global.Validform = factory();
    }
}(this, function (require) {
	
	

	function Validform(el, options){
		var defaults = {
			submitBtn:'', // el 下面找submit的元素
			checkType:0, // 1固定位置的提示 2.alert or 定义提示信息 
			isAjaxForm:false,//为true时提示信息将只会在表单提交时触发显示，各表单元素blur时不会被触发显示
			submitCallBack:$.noop
		}

		this.el = el;
		this.params = $.extend({}, defaults, options || {})
		// this.ajaxUrl = 
		this.postFlag = false; // 防二次点击的


		this.init();

		this.errorObj=null; //指示当前验证失败的表单元素;

		//校验成功，要么有指定的文字的，要么把之前的错误信息清空 2种展示方式

	}	


	Validform.prototype = {
		init: function(){
			var _this = this;

			// checkbox 长
			// this.el.find('[data-reg="checkbox"]').on('change',function(){
			// 	var name = $(this).attr('name');
			// 	var parNode = $(this).parent('.ui-filed').find('.ui-form-tip');
			// 	if(!$(this).parent('.ui-filed').find("[name='"+name+"']:checked").length){
			// 		// parNode.html(msg).addClass('ui-validform-wrong')
			// 		// _this.errorObj = $(this);						
			// 		return;
			// 	}else{
			// 		// validTip.html(_this.tipMsg.r).removeClass('ui-validform-wrong').addClass('Validform_right');
			// 		// parNode.html('').removeClass('ui-validform-wrong')
			// 		// _this.errorObj = null;
			// 	}
				
			// })
			
			this.el.find('[data-reg]').on('blur',function(){
				_this.checkFiled($(this));
				
			})

			

			// 如果做表单二次提交？
			

			// submit 提交表单
			this.el.on('submit',function(e){
				

				var isCheckFrm = _this.isFormCheckPassed();
				if(isCheckFrm){
					if(_this.params.isAjaxForm){
						// 通过ajax方式来题来提交表单
						if(typeof _this.params.submitCallBack === 'function'){
							$.ajax({
								// url:
							})
							_this.params.submitCallBack.call(this,_this.el.serialize())
						}	
					}else{
						// 直接跳转链接地址来提交表达
						return true;	
					}

				}else{
					_this.errorObj.focus();
					return false;
				}

			})

		},

		checkFiled: function(ele){
			var _this = this;
			var required = ele.attr('data-required');
				var msg = ele.attr('data-msg');
				var reg = ele.attr('data-reg');
				var err = ele.attr('data-err');
				var val = ele.val();
				var name = ele.attr('name');
				var parNode = ele.parents('.ui-filed').find('.ui-form-tip');

				if(required){
					
						if(reg === 'select'){
							if(val === ''){
								parNode.html(msg).addClass('ui-validform-wrong')
								_this.errorObj = ele;
								return false;
							}else{
								parNode.html('').removeClass('ui-validform-wrong');
								ele.attr('data-status',true);
								_this.errorObj = null;
								return true;
							}

						}else if(reg === 'checkbox' || reg === 'radio'){
							// 如果checked 的元素长度length为0。则提示

							// 	console.log(ele.parent('.ui-filed').find("[name='"+name+"']:checked").length)
							if(!ele.parent('.ui-filed').find("[name='"+name+"']:checked").length){
								parNode.html(msg).addClass('ui-validform-wrong')
								_this.errorObj = ele;						
								return false;
							}else{
								parNode.html('').removeClass('ui-validform-wrong');
								ele.attr('data-status',true);
								_this.errorObj = null;
								return true;
							} 

						}else{

							if(val === ''){
								parNode.html(msg).addClass('ui-validform-wrong')
								_this.errorObj = ele;						
								return false;
							}else if(reg === 'password'){

								var reCheckVal = ele.parents().find('[name="'+reg+'"]').val()
								if(val !== reCheckVal){
									parNode.html(err).addClass('ui-validform-wrong')
									_this.errorObj = ele;						
									return false;
								}else{
									parNode.html('').removeClass('ui-validform-wrong');
									ele.attr('data-status',true);
									_this.errorObj = null;
									return true;
								}


							}else if(!eval(reg).test(val)){
								parNode.html(err).addClass('ui-validform-wrong')
								_this.errorObj = ele;
								return false;
							}else{
								parNode.html('').removeClass('ui-validform-wrong');
								ele.attr('data-status',true);
								_this.errorObj = null;
								return true;
							}
						}




						
					


				}	

		},

		/**
		 * 
		 * @return {Boolean} [description]
		 */
		isFormCheckPassed: function(){
			var _this = this;
			var flag = true;
			this.el.find('[data-reg]').each(function(index,item){
				//只要有一项chestatus不为true则表单验证不通过
				
				var it = _this.checkFiled($(item));
				if(!it){
					flag = false;
					return flag;
				}


			})

			return flag;

		}


		

	}





	$.fn.Validform = function(options){
		return $(this).each(function() {
    		if (!$(this).data('Validform')) {
    			$(this).data('Validform', new Validform($(this), options));
    		}
    	});
	}

	
	return Validform;
    
}));
