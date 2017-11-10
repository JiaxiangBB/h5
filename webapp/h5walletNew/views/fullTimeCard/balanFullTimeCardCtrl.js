function balanFullTimeCardCtrl($scope,$ionicHistory,$state,$stateParams,$ionicModal){
	//$ionicLoading.show();//显示加载指示器
	//全时通卡余额
 	$("#balanFullTimeCard-view .balanFullTimeCardImg").attr("src",imgRrc+"h5images/quanshitongka_n"+variable+".png");

 	//公共参数
 	$scope.customerNo=getURLParameter("customerNo");
 	$scope.sessionId=localStorage.getItem("data");
 	$scope.certNo =localStorage.getItem("certNoData"); //身份证号
 //	console.log($scope.sessionId);

 	//获取url中的参数信息
 	var queryParam = angular.fromJson($stateParams.josnObj);
 	//console.log(queryParam);
 	$scope.aifavabalance = queryParam.aifavabalance;//全时通卡余额
 	$scope.fullCardNo = queryParam.fullCardNo;//全时通卡卡号

 	//用户信息查询
 	var parms = {};
 	parms.customerNo = $scope.customerNo;
 	parms.sessionId = $scope.sessionId;
	$.ajax({
		url :getRootPath()+"/CustomerAction.custInfoQuery.do?FAPView=JSON",
		type: 'post',
		data : parms,
		success : function(data) {
			var data=$.parseJSON(data);
			console.log(data.data);
			if(data.FAPStatus==0){
				if(data.success==true){
					var certNo=data.data.certNo;//身份证号
					//var certType=data.data.certType;//是否实名
					var customerNameCN=data.data.customerNameCN;//名字
					var mobileNo=data.data.mobileNo;//手机号
					//$scope.certType = certType ;//ui-sref传参数需要的 是否实名
					$scope.customerNameCN = customerNameCN;//名字
					$scope.mobileNo = mobileNo;//手机号
					$scope.certNo = certNo;//身份证号
					var CardObj = {cardNo:"",bankCardType:"",fullCardNo:$scope.fullCardNo,certNo:$scope.certNo,mobileNo:$scope.mobileNo,customerNameCN:$scope.customerNameCN};
					var josnObj= angular.toJson(CardObj);
					$scope.toRechfullTimeCard = function(){//充值
						$state.go('rechfullTimeCard',{'josnObj':josnObj});
					};

					//点击交易明细按钮 跳转到交易明细
					$scope.fullCardTraDetailsFun = function(){
						$state.go('fullCardTraDetails',{'josnObj':josnObj})
					}
				}else{
					//alert(data.errors.msg);
					$scope.msg =data.errors.msg;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			}else if(data.FAPStatus==2){
				//alert("请重新登录");
				loginH5Host();//从新调登录接口
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
	//点击右上角 显示删除全时通卡弹框
	$scope.showDelFullCard = function(){
		//alert("删除全时通卡")
		$scope.openModalFive();
	};
	//点击确定按钮 删除全时通卡 跳转到卡列表页面
	$scope.sureDelFullCard = function(){
		var parms = {};
		parms.customerNo = $scope.customerNo;//客户号
		parms.sessionId = $scope.sessionId;//令牌号
		parms.cardNo =$scope.fullCardNo;//卡号
		parms.symbol = 0 ;//密码类型
		parms.passWord = 1 ;//移动支付密码
		$.ajax({
			url :getRootPath()+"/PrepaidCardAction.prepaidCardDelete.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				console.log("--------全时通卡删除-------");
				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						$scope.msg = "您的全时通卡已成功删除";
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
						$scope.closeModalFive();
						////
						$ionicHistory.clearCache();
						$state.go('fullTimeCard');
					}else{
						$scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					}
				}else if(data.FAPStatus==2){
					loginH5Host();//从新调登录接口
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
	};
	//点击取消按钮 关闭全时通卡弹框
	$scope.closeDelFullCard = function(){
		//alert("删除全时通卡")
		$scope.closeModalFive();
	};
	//删除全时通卡弹框
	$ionicModal.fromTemplateUrl('templates/modalFive.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalFive = modal;
	});
	$scope.openModalFive = function() {
		$scope.modalFive.show();
	};
	$scope.closeModalFive = function() {
		$scope.modalFive.hide();
	};

	/////
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
		.controller("balanFullTimeCardCtrl",['$scope','$ionicHistory','$state','$stateParams','$ionicModal',balanFullTimeCardCtrl]);