function passwordSetCtrl($scope,$state,$ionicModal,$stateParams){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");

	//获取url中的参数信息
	var queryParam = angular.fromJson($stateParams.jsonObj);
	$scope.mobileNo = queryParam.mobileNo;//手机号
	$scope.certType = queryParam.certType;
	$scope.customerNameCN = queryParam.customerNameCN;
	$scope.certNo = queryParam.certNo;
	var obj = {certType:$scope.certType,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo};
	var jsonObj= angular.toJson(obj);
	console.log(jsonObj);
	//密码管理 页面
	$("#passwordSet-view .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");
	//跳转到修改支付密码
	$("#passwordSet-view .changePayPass").off("click").on("click",function(){
		$state.go('changePayPass',{'jsonObj':jsonObj})
	});
	//跳转到找回支付密码页面
	$("#passwordSet-view .tofindPayPass").off("click").on("click",function(){
		$state.go('findPayPass',{'jsonObj':jsonObj})
	});
};
angular.module("myapp")
		.controller("passwordSetCtrl",['$scope','$state','$ionicModal','$stateParams',passwordSetCtrl]);
