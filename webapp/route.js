function getRootPath(){   
    // var pathName = window.location.pathname.substring(1);   
    // var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));  
    // var str=window.location.host;
    // var rootPath;
    // if(str.substr(str.length-1,1)=="m"){
    // 	rootPath = window.location.protocol + '//' + str;
    // }else{
    //   rootPath = window.location.protocol + '//' + str + '/'+ 'service';
    // }
    // return  rootPath;
   return window.location.protocol + '//' + window.location.host;
};
//封装图片路径
function imgUrl(aa,bb){ 
	document.getElementById(bb).src="../"+aa; 
} 
//官网静态资源图片路径
//var imgSRC="http://image.ohepay.com/";
// var imgSRC="./img/";
var imgSRC="./build/";