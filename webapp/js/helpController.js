
/*--------------------------------------帮助中心-------------------------------------------------*/
function help($scope,$rootScope,$location,$state,$stateParams){
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
	/*$(".back").off("click").on("click",function(){
		var str = $stateParams.publicStr;
		var mstr = $stateParams.publicStr;
		if(str=="" || mstr==""){
			window.location.href="./index.html";
		}else{
			$scope.toMain(publicStr);
		}
	});*/
	
	/*$scope.cancel=function(){
		history.back();  
	}*/
	
	$(".help_header p a").off("click").on("click",function(){
		$(this).parent("p").find("span").css("left",($(this).index()*9+1)+"rem");
	})
	//导航 下载／注册
	$scope.navXiazai = function(){
		$(".ruhrxiazai").css("display","block")
		$(".howDownload").css("display","none")
		$(".howRegistered").css("display","none")
		$(".zhongzhiti").css("display","none")
		$(".yanzhengma").css("display","none")
	}
	//导航 充值／支付／提现
	$scope.chongzhiti = function(){
		$(".ruhrxiazai").css("display","none")
		$(".zhongzhiti").css("display","block")
		$(".yanzhengma").css("display","none")
		$(".howDownload").css("display","none")
		$(".howRegistered").css("display","none")
	}
	//如何下载
	$scope.xizai = function(){
		$(".search").css("display","none")
		$(".ruhrxiazai").css("display","none")
		$(".howDownload").css("display","block")
		$(".yanzhengma").css("display","none")
	}
	//如何注册
	$scope.zhuce = function(){
		$(".search").css("display","none")
		$(".ruhrxiazai").css("display","none")
		$(".howRegistered").css("display","block")
		$(".yanzhengma").css("display","none")
	}
	$scope.yanzheng = function(){
		$(".search").css("display","none")
		$(".ruhrxiazai").css("display","none")
		$(".howRegistered").css("display","none")
		$(".yanzhengma").css("display","block")
	}
	
};

angular.module("myapp")
       .controller("help",["$scope","$rootScope","$location","$state","$stateParams",help]);