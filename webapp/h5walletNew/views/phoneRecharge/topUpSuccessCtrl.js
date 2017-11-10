function topUpSuccessCtrl($scope,$state,$stateParams,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");

	//获取参数
	//{goodsInf:goodsInf,rcvCstName:rcvCstName,createTime:createTime,orderNo:orderNo};
	//var jsonObj= angular.toJson(obj);
	var params=angular.fromJson($stateParams.josnObj);
	//$scope.sellPrice=params.sellPrice;//实际缴费
	$scope.goodsInf=params.goodsInf;//充值说明
	$scope.mobile=params.mobile;//手机号
	$scope.amount=params.money;//充值金额
	$scope.merchName=params.rcvCstName;//交易对象
	$scope.createTime=params.createTime;//创建时间
	$scope.orderNo=params.orderNo;//订单号
	$scope.orderStatus=params.orderStatus;//订单状态
	if($scope.orderStatus=="0"){
		$scope.status="交易成功";
	}else{
		$scope.status="交易失败";
	}
	$scope.moneys=fmoney($scope.amount,2);//实际缴费
	$scope.time=$scope.createTime.substr(0,4)+"-"+$scope.createTime.substr(4,2)+"-"+$scope.createTime.substr(6,2)+" "+$scope.createTime.substr(8,2)+":"+$scope.createTime.substr(10,2)+":"+$scope.createTime.substr(12,2);
	//手机充值成功后详情图标
	$(".topUpSuccess p img").attr("src",imgRrc+"h5images/zhuanzhang"+variable+".png");

	$scope.goHome = function(){//返回首页
		$state.go("home");
	}
};
angular.module("myapp")
		.controller("topUpSuccessCtrl",['$scope','$state','$stateParams','$ionicModal',topUpSuccessCtrl]);