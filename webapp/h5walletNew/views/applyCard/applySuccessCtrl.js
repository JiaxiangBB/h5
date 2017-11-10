function applySuccessCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	var queryParam = angular.fromJson($stateParams.josnObj);
	$scope.amount=queryParam.amount;//支付面额
	$scope.orderno=queryParam.orderno;//订单号
	$scope.certNo=queryParam.cardnum;//张数
	$scope.createTime=queryParam.createTime;//创建时间
	$scope.money=queryParam.money;//总金额
	$scope.moneys=fmoney($scope.money,2);
	$scope.createDate=$scope.createTime.substr(0,4)+"-"+$scope.createTime.substr(4,2)+"-"+$scope.createTime.substr(6,2)+" "+$scope.createTime.substr(8,2)+":"+$scope.createTime.substr(10,2)+":"+$scope.createTime.substr(12,2);
	//console.log($scope.createTime);

	//全时钱包支付成功后详情
	$(".applySuccess p img").attr("src",imgRrc+"h5images/zhuanzhang"+variable+".png");
	//多张记录点击查看
	$scope.many=function(){
		var obj = {orderno:$scope.orderno};
	    var jsonPayObj = angular.toJson(obj);
        $state.go("applyCardList",{jsonPayObj:jsonPayObj});
	};
};
angular.module("myapp")
		.controller("applySuccessCtrl",['$scope','$stateParams','$state','$ionicModal',applySuccessCtrl]);