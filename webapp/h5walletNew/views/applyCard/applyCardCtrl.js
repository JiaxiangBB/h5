function applyCardCtrl($scope,$stateParams,$state,$http,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	var queryParam = angular.fromJson($stateParams.josnObj);
	var customerNameCN=queryParam.customerNameCN;//名字
	var mobile=queryParam.mobileNo;//手机号
	var certNo=queryParam.certNo;//身份证号
	//选择申请卡类型
	var parms = {};
	$http({
		 method:"POST",
		 url:getRootPath()+"/EcardAction.getCardProductDef.do?FAPView=JSON",
		 data:parms
	}).success(function (data) {
		//console.log("--卡产品查询--");
		//console.log(data);
		if(data.FAPStatus==0){
			if(data.success==false){
				//alert(data.errors.msg);
				$scope.msg = data.errors.msg;
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}else{
				$(".applyCard div img").attr("src",imgRrc+"h5images/icon_applyfor_qstcard.png");
				$scope.cardSelect=data.data.list[0].name;//电子卡类型
				$scope.information=function(){
					$scope.informations($scope.cardSelect);
				};
			}
		}else if(data.FAPStatus==2){
			loginH5Host();
		}else{
			//alert(data.FAPErrorMessage);
			$scope.msg = data.FAPErrorMessage;
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}
    });
	
	//点击申请电子卡
	$scope.informations=function(cardSelect){
		var obj = {certNo:certNo,customerNameCN:customerNameCN,mobile:mobile,cardSelect:cardSelect};
	    var jsonObj= angular.toJson(obj);
	    //console.log(obj)
		$state.go('information',{josnObj:jsonObj});
	}

	//弹框
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
		.controller("applyCardCtrl",['$scope','$stateParams','$state','$http','$ionicModal',applyCardCtrl]);