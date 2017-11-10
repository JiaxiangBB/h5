function getRootPath(){   
    var pathName = window.location.pathname.substring(1);   
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));  
    var str=window.location.host;
    var rootPath;
    if(str.substr(str.length-1,1)=="m"){
    	rootPath = window.location.protocol + '//' + str;
    }else{
    	rootPath = window.location.protocol + '//' + str + '/'+ webName + '/';
    }
  //如果是开发环境，则路径与测试环境不同
  //return window.location.protocol + '//' + window.location.host + '/'+ webName + "/";
  //return window.location.protocol + '//' + window.location.host + '/'+ webName + '/' + "micromall" + "/";  
    return  rootPath;
};

//ios下载
$(".iphone").on("click",function(){
	window.location.href="https://itunes.apple.com/cn/app/%E5%85%A8%E6%97%B6%E9%92%B1%E5%8C%85/id1172126710?mt=8";
});
//android下载
$(".android").on("click",function(){
	/*window.location.href=getRootPath()+"FileDownloadAction.appdownload.do";*/
	window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.ohepay.wallet";
});
