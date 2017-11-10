function transferSuccessCtrl($scope,$stateParams,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	var queryParam = angular.fromJson($stateParams.josnObj);
	$scope.recAcc = queryParam.recAcc;//收款账户
	$scope.amount = queryParam.amount;//转账金额
	$scope.name = queryParam.name;//收款人姓名
	$scope.fapTime = queryParam.fapTime;//转账时间
	$scope.orderId = queryParam.orderId;//订单号
	$scope.money=fmoney($scope.amount,2);

	//转账成功后详情图标
	$(".transferSuccess p img").attr("src",imgRrc+"h5images/zhuanzhang"+variable+".png");
	//点击完成
	$scope.complete=function(){
		location.href="./index.html?customerNo="+$scope.customerNo+"&sessionId="+$scope.sessionId;
	}
};
angular.module("myapp")
		.controller("transferSuccessCtrl",['$scope','$stateParams','$ionicModal',transferSuccessCtrl]);