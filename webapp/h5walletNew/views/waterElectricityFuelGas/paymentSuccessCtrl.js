function paymentSuccessCtrl($scope,$ionicModal,$stateParams,$state){
	//缴费成功后详情图标
	$(".paymentSuccess p img").attr("src",imgRrc+"h5images/zhuanzhang"+variable+".png");

	var params=angular.fromJson($stateParams.jsonObj);
	var transactionOrderDetail = params.transactionOrderDetail;//付款成功之后 订单详情
	$scope.trxAmount = transactionOrderDetail.trxAmount;//订单金额
	$scope.receiverName=params.receiverName;//公共事业单位名称
	$scope.goodsInf = transactionOrderDetail.goodsInf;//充值说明
	$scope.userNo = params.userNo;//缴费账户
	$scope.rcvCstName = transactionOrderDetail.rcvCstName;//交易对象 rcvCstName
	$scope.createTime = transactionOrderDetail.createTime;//创建时间 createTime
	$scope.orderNo = transactionOrderDetail.orderNo;//orderNo订单号
	console.log(transactionOrderDetail);
	$scope.createTimeNum = $scope.createTime.substr(0,4)+"-"+$scope.createTime.substr(4,2)+"-"+$scope.createTime.substr(6,2)+"  "+$scope.createTime.substr(8,2)+":"+$scope.createTime.substr(10,2);

	$scope.goTime = function(){
		$state.go("home");
	}
};
angular.module("myapp")
		.controller("paymentSuccessCtrl",['$scope','$ionicModal','$stateParams','$state',paymentSuccessCtrl]);
