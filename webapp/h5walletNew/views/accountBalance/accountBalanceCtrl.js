function accountBalanceCtrl($scope,$state,$stateParams,$ionicModal){
//$ionicLoading.show();//显示加载指示器
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.isApp = getURLParameter("isApp");//isApp
	console.log($scope.isApp);
	if($scope.isApp == "1"){//判断是否从APP端访问
		$scope.isAppFlag = true;
	}else{
		$scope.isAppFlag = false;
	}

	$scope.onAccountBalanceBackFun = function(){//账户余额 返回APP 
		var data = {
			"isApp":"1"
		}
		callHandler('onAccountBalanceBackApp',data,function(res){//与APP交互的函数

		});
	}
	//返回APP协议参数
	
	//账户余额
	$("#accountBalance-view .accountBalanceImg").attr("src",imgRrc+"h5images/icon_jinegai_yellow"+variable+".png");
	$("#paymentMethod-view .paymentMethod .cardImg01").css("background-image","url("+imgRrc+"h5images/icon_bank_zgnyyh"+variable+".png)")
	$("#paymentMethod-view .paymentMethod .cardImg02").css("background-image","url("+imgRrc+"h5images/icon_bank_zgnyyh"+variable+".png)")
	$("#paymentMethod-view .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");
	$("#bankPhoneCode-view .bankPhoneCode .rechargeNum").css("background-image","url("+imgRrc+"h5images/jine"+variable+".png)");


	// //截取身份证号中间十位数
	// var certNo = queryParam.certNo.substring(4,queryParam.certNo.length-4);
	// $scope.certNo = queryParam.certNo.substr(0,4)+certNo.replace(certNo,"**********")+queryParam.certNo.substr(queryParam.certNo.length-4,4)
	// $scope.certNo = queryParam.certNo;//身份证

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
					$scope.accountBalance = localStorage.getItem("numBer");
					// var obj = {certType:$scope.certType,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo};
					// var jsonObj= angular.toJson(obj);
					//console.log(jsonObj);
					//点击充值按钮 跳转下一页
					var accountObj = {customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo,accountBalance:$scope.accountBalance};
					var jsonAccountObj= angular.toJson(accountObj);

					var payObj={cardNo:"",money:$scope.accountBalance,bankCardType:""};
					var jsonPayObj = angular.toJson(payObj);
					$scope.rechargeFun = function(){
						$state.go('bankPhoneCode',{'jsonAccountObj':jsonAccountObj,'jsonPayObj':jsonPayObj});
					};
				}else{
					//alert(data.errors.msg);
					$scope.msg = data.errors.msg;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			}else if(data.FAPStatus==2){
				//alert("请重新登录");
				loginH5Host();//从新调登录接口
			}else{
				//alert(data.FAPErrorMessage);
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
	//账户余额
	var parms = {};
	parms.customerNo= $scope.customerNo;//客户号
	$.ajax({
		url :getRootPath()+"/PrepaidCardAction.cardBalQuery.do?FAPView=JSON",
		type: 'post',
		data : parms,
		success : function(data) {
			var data=$.parseJSON(data);
			console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					$scope.accountBalance = fmoney(data.data.bankLists.avaAccountBalance,2);//总资产
					$scope.balance_wrap = fmoney(data.data.bankLists.avaBalance,2);//账户余额
					
					//将账户余额存储到localStorage
					localStorage.setItem("numBer",$scope.accountBalance);//将value存储到key字段
                    var accountBalance=localStorage.getItem("numBer");  
                    console.log(accountBalance);
				}else{
					//alert(data.errors.msg);
					$scope.msg = data.errors.msg;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			}else if(data.FAPStatus==2){
				//alert("请重新登录");
				loginH5Host();//从新调登录接口
			}else{
				//alert(data.FAPErrorMessage);
				$scope.msg = data.FAPErrorMessage;
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}
		},
		error:function(a,b,c){
			alert("错误");
		}	
	});
	
	//点击交易明细按钮 跳转到交易明细
	$scope.transactionDetails = function(){
		$state.go('transactionDetails')
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
		.controller("accountBalanceCtrl",['$scope','$state','$stateParams','$ionicModal',accountBalanceCtrl]);