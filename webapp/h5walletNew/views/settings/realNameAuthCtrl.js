function realNameAuthCtrl($scope,$ionicHistory,$state,$ionicModal,$stateParams){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.certNo =localStorage.getItem("certNoData");
	$scope.customerNameCN =localStorage.getItem("customerNameData");//姓名
	$scope.mobileNo =localStorage.getItem("mobileData");//手机号
	
	//实名认证
	$("#realNameAuth-view .realNameAuth .real_Name").css("background-image","url("+imgRrc+"h5images/icon_xingming_realname"+variable+".png)");
	$("#realNameAuth-view .realNameAuth .id_Card").css("background-image","url("+imgRrc+"h5images/icon_idcard_realname"+variable+".png)");
	//实名认证接口调用
	$scope.next_sub=function(){
		var realName=$(".authenticationName").val();//真实姓名
		var certNo=$(".IdNumber").val();//身份证号
		//console.log(realName);
		//console.log(certNo);
		var parms = {};
		parms.customerNo = $scope.customerNo;
		parms.sessionId = $scope.sessionId;
		parms.realName = realName;
		parms.certNo = encryptByDES(certNo);//省份证号
		parms.certType = "1";
		parms.certExpire="";//证件有效期
		/*parms.facadeImg=facadeImg;
		parms.backImg=backImg;*/
		parms.payPwd="";//支付密码
		$.ajax({
			url :getRootPath()+"/SecurityCenterAction.certifyByUploadCert.do?FAPView=JSON",
			type:'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				console.log(data);
				$scope.FAPErrorMessage = data.FAPErrorMessage;
				if(data.FAPStatus==0){
					if(data.success==true){
						var authStatus = data.data.authStatus;
						console.log(authStatus);
						localStorage.setItem("trueNameStatusData",authStatus);//将 判断是否实名 储存到localStorage
						//认证成功之后调用模态框
						$scope.openModal();
						$scope.realNameSuccessd = function(){
							$ionicHistory.clearCache();
							var obj = {certType:$scope.certNo,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo};
							var jsonObj= angular.toJson(obj);
							$state.go('settings',{'jsonObj':jsonObj});
							$scope.closeModal();
						};
					}else{
						$scope.msg = data.errors.msg;
						//console.log($scope.msg);
						//认证失败 弹框
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*4);
					}
				}else if(data.FAPStatus==2){
					loginH5Host();//重新登录
				}else{
					//FAPStatus: 1 弹框
					$scope.openModalTwo();
					setTimeout(function(){
						$scope.closeModalTwo();
					},1000*4);
				}
			},
			error : function(){
				location = "index.html";
			}
		});
	}
	//实名认证成功之后弹框
	$ionicModal.fromTemplateUrl('templates/modalOne.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalOne = modal;
	});
	$scope.openModal = function() {
		$scope.modalOne.show();
	};
	$scope.closeModal = function() {
		$scope.modalOne.hide();
	};
	//输入格式错入弹框 FAPStatus: 1
	$ionicModal.fromTemplateUrl('templates/modalTwo.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalTwo = modal;
	});
	$scope.openModalTwo = function() {
		$scope.modalTwo.show();
	};
	$scope.closeModalTwo = function() {
		$scope.modalTwo.hide();
	};
	// //认证失败 弹框
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
		.controller("realNameAuthCtrl",['$scope','$ionicHistory','$state','$ionicModal','$stateParams',realNameAuthCtrl]);