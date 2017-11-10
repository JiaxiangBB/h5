/*--------------------------------------新手指引-------------------------------------------------*/
function guild($scope,$rootScope,$location,$state,$stateParams){
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
		var mstr = $stateParams.publicStr;
		if(str=="" || mstr==""){
			window.location.href="./index.html";
		}else{
			$scope.toMain(publicStr);
		}
	})*/
	
	$scope.liaojie = function(){
		$(".search").css("display","none")
		$(".guild_main ul").css("display","none")
		$(".xinshoushanglu").css("display","block")
	}
	$scope.guild=function(){
		$(".search").css("display","block")
		$(".guild_main ul").css("display","block")
		$(".xinshoushanglu").css("display","none")
	}
	
};
angular.module("myapp")
		.controller("guild",["$scope","$rootScope","$location","$state","$stateParams",guild]);