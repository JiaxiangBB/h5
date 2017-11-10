function billingDetailsCtrl($scope,$stateParams,$state,$ionicModal){
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
	$scope.phsid = queryParam.phsid;//缴费项目Id
	console.log(queryParam)
 			// {text:$scope.text,type:$scope.type,phsid:$scope.phsid,companyName:$scope.companyName,cid:$scope.cid,pid:$scope.pid,picoid:$scope.picoid,protype:$scope.protype,cityName:$scope.cityName,yearmonth:$scope.yearmonth,paymentNum:$scope.paymentNum,truename:$scope.truename};
	$scope.showMessage=true;//缴费信息初始化不显示
	var jsonObj={text:$scope.text,type:$scope.type,companyName:$scope.companyName,cid:$scope.cid,pid:$scope.pid,picoid:$scope.picoid,protype:$scope.protype,cityName:$scope.cityName,bills:$scope.bills,yearmonth:$scope.yearmonth,paymentNum:$scope.paymentNum,truename:$scope.truename}
	var waterJsonObj= angular.toJson(queryParam);
	//输入金额
	var rules_money =/^\d+(\.\d+)?$/;
	$(".inputMoney").keyup(function(){
		if(rules_money.test($(this).val())){
			$(".paymentConfirm").css("opacity","1");
		}else{
			$(".paymentConfirm").css("opacity","0.4");
		}
	});

	//点击下一步支付
	$(".paymentConfirm").off("click").on("click",function(){
		if($(this).css("opacity")=="1"){
			$scope.money = fmoney($(".inputMoney").val(),2);
			var lifeParam={money:$scope.money};
			var lifeJsonObj=angular.toJson(lifeParam);
			console.log(waterJsonObj);
			console.log(lifeJsonObj);
			$state.go("paymentConfirm",{'waterJsonObj':waterJsonObj,'lifeJsonObj':lifeJsonObj});
		}else{
			if($(".inputMoney").val()==""){
				$scope.msg = "支付金额为空";
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}else{
				$scope.msg = "支付金额格式错误";
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}
		}
	});
	//调用弹框
	$ionicModal.fromTemplateUrl('templates/modalThree.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalThree = modal;
		//console.log($scope.modalSix)
		$scope.openModalThree = function() {
			$scope.modalThree.show();
		};
		$scope.closeModalThree = function() {
			$scope.modalThree.hide();
		};
	});
	//弹框3
	$ionicModal.fromTemplateUrl('templates/modalThree.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalThree = modal;
	});
	$scope.openModalThree = function() {
		$scope.modalThree.show();
	};
	$scope.closeModalThree = function() {
		$scope.modalThree.hide();
	};
};
angular.module("myapp")
		.controller("billingDetailsCtrl",['$scope','$stateParams','$state','$ionicModal',billingDetailsCtrl]);