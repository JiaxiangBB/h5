function paymentConfirmCtrl($scope,$stateParams,$state,$ionicModal){
	//账单详情金额图标
	$(".paymentConfirm h2 img").attr("src",imgRrc+"h5images/icon_zhuannext_money_w"+variable+".png");

	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.certNo=localStorage.getItem("certNoData");//身份证号
	$scope.customerNameCN=localStorage.getItem("customerNameData");//姓名
	$scope.mobileNo=localStorage.getItem("mobileData");//手机号

	var queryParam = angular.fromJson($stateParams.waterJsonObj);
	$scope.text=queryParam.text;//名字
	$scope.type=queryParam.type;//缴费类型 1 水费  2 电费  3 燃气费
	$scope.companyName=queryParam.companyName;//缴费单位
	$scope.cid = queryParam.cid;//城市id
	$scope.pid = queryParam.pid;//省id
	$scope.picoid = queryParam.picoid;//公司编号
	$scope.protype = queryParam.protype;//产品类型
	$scope.cityName = queryParam.cityName;//缴费城市
	$scope.yearmonth = queryParam.yearmonth;//缴费账单日期
	$scope.paymentNum = queryParam.paymentNum;//客户编号
	$scope.truename = queryParam.truename;//用户名
	
	var lifeParam = angular.fromJson($stateParams.lifeJsonObj);
	$scope.money=lifeParam.money;//缴费金额
	//console.log(queryParam)
	//console.log(lifeParam)
	//立即缴费
	//text:$scope.text,type:$scope.type,companyName:$scope.companyName,cid:$scope.cid,pid:$scope.pid,picoid:$scope.picoid,protype:$scope.protype,cityName:$scope.cityName,yearmonth:$scope.yearmonth,paymentNum:$scope.paymentNum,truename:$scope.truename}
	$scope.paymentWay=function(){
		var obj = {yearmonth:$scope.yearmonth,money:$scope.money,dataType:"4",payType:"4",areaName:$scope.cityName,receiverName:$scope.companyName,userNo:$scope.paymentNum,itemName:$scope.text,phsid:$scope.type,picoid:$scope.picoid,pid:$scope.pid,cid:$scope.cid,truename:$scope.truename,protype:$scope.protype,phsid:queryParam.phsid};
        var jsonObj= angular.toJson(obj);
        var lifeParam={money:$scope.money};
		var lifeJsonObj=angular.toJson(lifeParam);
        console.log(jsonObj);
		$state.go("paymentWay",{'josnObj':jsonObj,'lifeJsonObj':lifeJsonObj});
	};
};
angular.module("myapp")
		.controller("paymentConfirmCtrl",['$scope','$stateParams','$state','$ionicModal',paymentConfirmCtrl]);