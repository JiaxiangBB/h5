/*--------------------------------------客户端下载-------------------------------------------------*/
function client($scope,$rootScope,$location,$state,$stateParams){
	//获取wrap页面的参数         
	//解析url参数     wrap页面    publicStr
	var obj="";
	var str = $stateParams.publicStr;
	if(str==""){
		
	}else{
		var privateStr=privateKey(str);
		obj=angular.fromJson(privateStr);
	}
	
   $scope.customerNo = obj.customerNo;
   $scope.sessionId = obj.sessionId; 
   $scope.mobile = obj.mobile;
   $scope.customerNameCN = obj.customerNameCN;
   $scope.payPwdFlag = obj.payPwdFlag;//是否设置支付密码
   $scope.password = obj.password;//登录密码
   $scope.lastLogonTime = obj.lastLogonTime;//最后一次登录时间
   
   //定义全局变量
   var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
	var publicStr=publicKey(str);
	
	//向main.html页面传参数        
    $scope.toMain = function (publicStr){
    	$state.go('wrap.main', {publicStr: publicStr});
    }
	//点击返回按钮
	/*$(".back").off("click").live("click",function(){
		var str = $stateParams.publicStr;
		if(str==""){
			window.location.href="./index.html";
		}else{
			$scope.toMain(publicStr);window
		}
	})*/
	//Android下载客户端
	$scope.android=function(){
		window.location.href=getRootPath()+"/FileDownloadAction.appdownload.do";
	}
	//ios下载客户端
	$scope.ios = function(){
		window.location.href="https://itunes.apple.com/us/app/quan-shi-qian-bao/id1172126710?l=zh&ls=1&mt=8";
	}
	
	//手机端Android下载客户端
	$scope.androidIphone=function(){
		window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.ohepay.wallet";
	}
	//手机端ios下载客户端
	$scope.iosIphone = function(){
		window.location.href="https://itunes.apple.com/cn/app/全时钱包/id1172126710?mt=8";
	}
	
	$scope.clientFun = function(){
		var screen = document.body.clientWidth;
		//console.log(screen);
		//alert(screen);
		if(screen <="1246"){
			$(".client_footer").css("display","none");
			$(".client_footer_phone").css("display","block");
			
			$(".client_ios").css("display","none");//ios
			$(".client_android").css("display","none");
			$(".client_ios_iphone").css("display","block");
			$(".client_android_iphone").css("display","block");
		}else{
			$(".client_footer").css("display","block");
			$(".client_footer_phone").css("display","none");
		};
	};
	$scope.clientFun();
};

angular.module("myapp")
		.controller("client",["$scope","$rootScope","$location","$state","$stateParams",client]);