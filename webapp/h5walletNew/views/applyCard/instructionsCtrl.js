function instructionsCtrl($scope,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
};
angular.module("myapp")
		.controller("instructionsCtrl",['$scope','$ionicModal',instructionsCtrl]);