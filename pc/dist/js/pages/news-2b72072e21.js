!function(){this.$YK={version:"0.1",emptyFunction:function(){}},this.$YK.utils={getQueryByName:function(e){var t=location.search.match(new RegExp("[?&]"+e+"=([^&]+)","i"));return null==t||t.length<1?"":t[1]},replaceTmpl:function(e,n){return(""+e).replace(/\$(\w+)\$/g,function(e,t){return"undefined"!=typeof n[t]?n[t]:"$"+t+"$"})},baidu:function(e,t,n,o){try{var r=function(){window._hmt.push(["_trackEvent",e,t,n,o])};window._hmt?r():(!function(){window._hmt=[];var e=document.createElement("script"),t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}(),setTimeout(function(){r()},1e3))}catch(a){}},request:function(e,t,n,o,r,a){n=n||$YK.emptyFunction,o=o||$YK.emptyFunction;var c={url:e,headers:{"X-Requested-With":"XMLHttpRequest"},data:t,contentType:"text/json; charset=utf-8",dataType:"json",crossDomain:!0,success:function(e){0==e.errno?n(e):o(e)},timeout:5e3,error:function(e,t){o("timeout"==t?{errno:502,msg:"网络超时，请重试！"}:{errno:500,msg:"系统内部错误，请稍后再试！"})},type:r};return a&&(c.dataType="jsonp",c.jsonp="_jsonp",c.type="GET"),$.ajax(c)},include:function(e,i,s){var u=document.getElementsByTagName("head")[0]||document.documentElement,t=(i=i||"","string"==typeof e?[e]:e),p=0,d=t.length;$(t).each(function(e){var t=this.toString().replace(/^\s|\s$/g,""),n=t.split("."),o="css"==n[n.length-1].toLowerCase(),r=o?"link":"script",a=document.createElement(r);if(o?(a.href=i+t,a.rel="stylesheet",a.type="text/css"):(a.type="text/javascript",a.src=i+t),!o&&"function"==typeof s){var c=function(){++p==d&&setTimeout(s,1),u&&a.parentNode&&u.removeChild(a)};a.readyState?a.onreadystatechange=function(){"loaded"!=a.readyState&&"complete"!=a.readyState||(c(),a.onreadystatechange=null)}:a.onload=c}u.appendChild(a)})}}}(),console.log("news info");