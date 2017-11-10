function comProblemsCtrl($scope,$ionicHistory,$state,$stateParams,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");

	//设置页面
	$("#comProblems-view .comProblemsIcon img").attr("src",imgRrc+"h5images/wentixiangqing"+variable+".png");
	$("#comProblems-view .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");
	//提现
	$("#comProblems-view .depositBox img").attr("src",imgRrc+"h5images/wentixiangqing"+variable+".png");
	// //$ionicLoading.show();//显示加载指示器
	// $(".homeFooter p img").attr("src",imgRrc+"h5images/icon-rukou-logo"+variable+".png");
};
angular.module("myapp")
		.controller("comProblemsCtrl",['$scope','$ionicHistory','$state','$stateParams','$ionicModal',comProblemsCtrl]);
