/**
 * PC 端 游卡通行证组件
 * *
 */

(function (global, factory) {
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory);
    } else {
        global.Validate = factory();
    }
}(this, function (require) {
	// if (typeof require == 'function') {
	// 	require('common/ui/ErrorTip');
	// } else if (!$().follow) {
	// 	if (window.console) {
	// 		console.error('need ErrorTip.js');
	// 	}
	// 	return {};
	// }


	var LOGIN_COOKIE = "_we_login",
		COOKIE_VAL = 1,
		IFRAME_HTML = '<iframe src="' + $we.conf.ENV.__LOGIN_FRAME + '" style="display:none"></iframe>',
		MCAS_IFRAME_HTML = '<iframe src="' + $we.conf.ENV.__MLOGIN_FRAME + '" style="display:none"></iframe>',
		/**
		 * frameLogin class
		 */
		frameLogin = {
			bForce: false,
			set: function() {
				// 如果已经设置了cookie，并且不是强制调用，那么就直接返回
				// if ($.cookie(LOGIN_COOKIE) && !this.bForce) return;
				// 新增一个iframe
				var ifr = $(IFRAME_HTML).appendTo($("body"));
				// 设置cookie
				// $.cookie(LOGIN_COOKIE, COOKIE_VAL);
				// 当iframe 加载成功之后，触发 success事件
				ifr.on("load", function() {
					frameLogin.success();
				});
				// this.bForce = false;
			},
			success: $we.emptyFunction,
			fail: $we.emptyFunction
		};

	/**
	 * 设置登录
	 * @param {boolean} bForce  是否强制登录
	 * @param {function} success 成功的回调
	 * @param {function} fail    失败的回调
	 */
	$we.setLogin = function(bForce, success, fail) {
		// if (bForce) frameLogin.bForce = true;
		if (success) frameLogin.success = success;
		if (fail) frameLogin.fail = fail;
		// 调用jsonp接口，该接口将会触发 checkstat 方法
		$we.utils.include($we.conf.ENV.__CAS_STATE_API);
		// 设置手机账号群的登录态
		$(MCAS_IFRAME_HTML).appendTo($("body"));
	};

	/**
	 * 声明checkstat方法
	 * @param {object} stat 状态
	 */
	window.checkstat = function(stat) {
		// 如果已经登录，调用frameLogin.set
		if (stat.CAS_LOGIN_STATE == "1") {
			frameLogin.set();
		} else {
			// 如果尚未登录，直接调用失败
			frameLogin.fail();
		}
	};

	// 当自动登录开关打开，在dom ready之后直接调用登录接口
	if ($we.conf.RUNTIME.__AUTOLOGIN) {
		$(document).ready(function() {
			$we.setLogin();
		});
	}

	return $we.setLogin;





    // return Validate;
}));



