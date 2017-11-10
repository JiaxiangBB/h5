function personalInforCtrl($scope,$stateParams,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	
	//获取url中的参数信息
	var queryParam = angular.fromJson($stateParams.jsonObj);
	$scope.certType = queryParam.certType;//是否实名
	$scope.customerNameCN = queryParam.customerNameCN;//姓名
	$scope.mobileNo = queryParam.mobileNo;//手机号
	//截取身份证号中间十位数
	var certNo = queryParam.certNo.substring(4,queryParam.certNo.length-4);
	//console.log(certNo);
	$scope.certNo = queryParam.certNo.substr(0,4)+certNo.replace(certNo,"**********")+queryParam.certNo.substr(queryParam.certNo.length-4,4)
	// $scope.certNo = queryParam.certNo;//身份证
	//console.log(queryParam);
	//console.log($scope.mobileNo);

	if ($scope.certType == 0) {
		$(".personalName").text("未实名认证");
		$(".personalCertNo").text("未实名认证");
	}else if ($scope.certType == 1) {
		$(".personalName").text($scope.customerNameCN);
		$(".personalCertNo").text($scope.certNo);
	}
};
angular.module("myapp")
		.controller("personalInforCtrl",['$scope','$stateParams','$ionicModal',personalInforCtrl]);