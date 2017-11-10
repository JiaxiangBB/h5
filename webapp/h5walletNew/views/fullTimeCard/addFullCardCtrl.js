function addFullCardCtrl($scope,$ionicHistory,$state,$stateParams,$ionicModal){
	//$ionicLoading.show();//显示加载指示器
	//添加全时通卡
	$("#addFulltimeCard-view .addFullCardNum .lockCard").css("background-image","url("+imgRrc+"h5images/icon_kahao"+variable+".png)");
	$("#addFulltimeCard-view .addFullCardNum .lockPass").css("background-image","url("+imgRrc+"h5images/icon_mima_black"+variable+".png)");
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");

	//获取url中的参数信息
	var queryParam = angular.fromJson($stateParams.josnObj);
	console.log(queryParam);
	$scope.certNo = queryParam.certNo;//身份证号
	$scope.mobileNo = queryParam.mobileNo;//手机号
	$scope.customerNameCN = queryParam.customerNameCN;//姓名

	var Obj = {certNo:$scope.certNo,mobileNo:$scope.mobileNo,customerNameCN:$scope.customerNameCN};
	var jsonObj= angular.toJson(Obj);

	var fullMsg={aifavabalance:$scope.aifavabalance,fullCardNo:$scope.fullCardNo,bankCardType:$scope.bankCardType};
	var fullMsgObj= angular.toJson(fullMsg);
	//添加全时通卡
	$scope.addFullCard = function(){
	 	var cardNumber = $("#fullCardNum").val();//全时通卡卡号
	 	var cardPassword = $("#fullCardPassword").val();//卡密码  

	 	if(cardNumber!="" && cardPassword!=""){
	// 		  if($(".form_group .agree").attr("checked")){
	 				var parms = {};
	 				parms.customerNo = $scope.customerNo;//客户号
	 				parms.sessionId = $scope.sessionId;//令牌号
	 				parms.cardNo = encryptByDES(cardNumber);//卡号
	 				parms.cardPayPwd = encryptByDES(cardPassword);//卡支付密码
	 				$.ajax({
	 					url :getRootPath()+"/PrepaidCardAction.prepaidCardAdd.do?FAPView=JSON",
	 					type: 'post',
	 					data : parms,
	 					success : function(data) {
	 						var data=$.parseJSON(data);
	 						console.log(data);
							if(data.FAPStatus==0){
								if(data.success==true){
									$scope.msg = "您的全时通卡已添加成功";
									$scope.openModalThree();
									setTimeout(function(){
										$scope.closeModalThree();
									},1000*3);
									$ionicHistory.clearCache();
									$state.go('fullTimeCard');
							    	//2400020081000040930
								}else{
									$scope.msg = data.errors.msg;
									$scope.openModalThree();
									setTimeout(function(){
										$scope.closeModalThree();
									},1000*3);
								}
							}else if(data.FAPStatus==2){
								loginH5Host();
							}else{
								$scope.msg = data.FAPErrorMessage;
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
							}
	 					},
	 					error:function(a,b,c){
	 					//	alert("错误");
	 					}					
	 				});
	// 			}else{
	// 				$(".error_message").css("opacity","1");
	// 				$(".error_message").find("b").text("请先阅读全时通卡章程");
	// 			}
	 	}else{
	 	 	$scope.msg = "全时通卡号及密码不可为空";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
	 	}
	};

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
		.controller("addFullCardCtrl",['$scope','$ionicHistory','$state','$stateParams','$ionicModal',addFullCardCtrl]);