/**
 * 
 */

	
 		function getRootPath(){   
		    var pathName = window.location.pathname.substring(1);   
		    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));  
		    var str=window.location.host;
		    var rootPath;
		    if(str.substr(str.length-1,1)=="m"){
		    	rootPath = window.location.protocol + '//' + str;
		    }else{
		    	rootPath = window.location.protocol + '//' + str + '/'+ webName ;
		    }
		  //如果是开发环境，则路径与测试环境不同
		  //return window.location.protocol + '//' + window.location.host + '/'+ webName + "/";
		  //return window.location.protocol + '//' + window.location.host + '/'+ webName + '/' + "micromall" + "/";  
		    return  rootPath;
		};
 		
 		/**
 		 * 截取URL获取参数
 		 */	
 		function getUrlParam(){
 			var url = location.href;
 			var paramSuit = url.substring(url.indexOf('?') + 1).split("&");
 			var paramObj = {};
 			for (var i = 0; i < paramSuit.length; i++) {
 				var param = paramSuit[i].split('=');
 				if (param.length == 2) {
 					var key = decodeURIComponent(param[0]);
 					var val = decodeURIComponent(param[1]);
 					if (paramObj.hasOwnProperty(key)) {
 						paramObj[key] = jQuery.makeArray(paramObj[key]);
 						paramObj[key].push(val);
 					} else {
 						paramObj[key] = val;
 					}
 				}
 			}
 			return paramObj;
 		}
 		