/**
 * 全站配置信息,可以对对象扩展方法功能
 * todo对外暴露扩展接口
 * @wutianzhi
 * @DateTime  2018-04-05T21:31:03+0800
 * @return    {[YKGame]}                 [description]
 */

(function(){
  this.$YK = {
    version: '0.1',
    emptyFunction: function() {}
  }

  this.$YK.utils = {
    /**
     * Get Query By Name
     */
    getQueryByName: function(name) {
      var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
      if (result == null || result.length < 1) {
        return "";
      }
      return result[1];
    },

    /**
     * 替换模板，$str$
     * @param  {string} str  模板字符串
     * @param  {object} conf 模板替换配置
     * @return {string}      字符串
     */
    replaceTmpl: function(str, conf) {
      return ("" + str).replace(/\$(\w+)\$/g, function(a, b) {
        return typeof conf[b] != "undefined" ? conf[b] : "$" + b + "$"
      });
    },

    /**
     * 用于百度统计
     * @param  {[type]} category  [description]
     * @param  {[type]} action    [description]
     * @param  {[type]} opt_label [description]
     * @param  {[type]} opt_value [description]
     * @return {[type]}           [description]
     */
    baidu: function(category, action, opt_label, opt_value) {
      try {
        var _init = function() {
          window._hmt = [];
          var hm = document.createElement("script");
          // hm.src = "//hm.baidu.com/hm.js?4f1327bf0d34c7c0b2adfe37e1e842cc";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        };

        var _push = function() {
          window._hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
        };
        if (!window._hmt) {
          // window._BALoad = true;
          _init();
          setTimeout(function() {
            _push();
          }, 1000);
        } else {
          _push();
        }
      } catch (e) {}
    },

    /**
     * ajax请求统一封装
     * @param  {string}  url     URL
     * @param  {object}  data    数据
     * @param  {function}  success 成功的回调
     * @param  {function}  fail    失败的回调
     * @param  {string}  method  POST/GET
     * @param  {Boolean} isJsonp 是否是jsonp
     * @return {object} jxhr
     */
    request: function(url, data, success, fail, method, isJsonp) {
      var loginTryMaxTimes = 1,
        loginTryTimes = 0, // 初始化登录尝试次数
        success = success || $YK.emptyFunction,
        fail = fail || $YK.emptyFunction,
        option = {
          url: url,
          headers: {
            "X-Requested-With": "XMLHttpRequest" // 标识该请求为ajax请求
          },
          data: data,
          contentType: "text/json; charset=utf-8",
          dataType: "json",
          crossDomain: true,
          success: function(resp) {
            if (resp.errno == 0) {
              success(resp);
            } else {
              fail(resp)
            }

          },
          timeout: 5000,
          error: function(resp, error) {
            if (error == "timeout") {
              fail({
                errno: 502,
                msg: '网络超时，请重试！'
              });
            } else {
              fail({
                errno: 500,
                msg: '系统内部错误，请稍后再试！'
              });
            }
          },
          type: method
        };



      // 如果是jsonp
      if (isJsonp) {
        option.dataType = "jsonp";
        option.jsonp = "_jsonp";
        option.type = "GET";
      }


      return $.ajax(option);
    },

    /**
     * script loader
     * @param  {mixed} file 需要加载的文件，string或者array
     * @param  {string} path 路径
     * @return {function}      回调函数
     */
    include: function(file, path, callback) {
      var head = document.getElementsByTagName("head")[0] || document.documentElement,
        path = path || "",
        files = typeof file == "string" ? [file] : file, // 统一转成array
        done = 0, // 已经加载完的数量
        len = files.length; // 总共需要加载的文件数量

      $(files).each(function(index) {
        var name = this.toString().replace(/^\s|\s$/g, ""), // 去除前后空格
          att = name.split('.'),
          ext = att[att.length - 1].toLowerCase(),
          isCSS = ext == "css",
          tagName = isCSS ? "link" : "script",
          tag = document.createElement(tagName); // 创建link 或者 script

        if (isCSS) {
          tag.href = path + name;
          tag.rel = "stylesheet";
          tag.type = "text/css";
        } else {
          tag.type = "text/javascript";
          tag.src = path + name;
        }

        // 如果不是css且存在callback，那么需要处理一下回调函数的问题
        if (!isCSS && typeof callback == "function") {
          // 处理每个script load完之后的事件
          var _handleCb = function() {
            // 增加一个完成数，如果全部都完成，处理回调
            if (++done == len) setTimeout(callback, 1);
            // 删除当前的script
            if (head && tag.parentNode) {
              head.removeChild(tag);
            }
          };

          if (tag.readyState) { // IE
            tag.onreadystatechange = function() {
              if (tag.readyState == "loaded" || tag.readyState == "complete") {
                _handleCb();
                tag.onreadystatechange = null; // memory leak
              }
            };
          } else { //Others
            tag.onload = _handleCb;
          }
        }

        // 这句话一定一定要放在最后，否则在IE下会有各种诡异问题
        head.appendChild(tag);
      });
    }
  }
})();


// !!!一定要加分号，不然压缩会报错