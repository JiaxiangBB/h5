function payMessageCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	//获取参数
	var params=angular.fromJson($stateParams.josnObj);
	$scope.customerNameCN=params.customerNameCN;//名字                 ThridPayAccountAction.myOrderTradeQuery 
	$scope.mobile=params.mobileNo;//手机号
	$scope.certNo=params.certNo;//身份证号
	var queryParam = angular.fromJson($stateParams.jsonPayObj);
	$scope.cardNo=queryParam.cardNo;//卡号
	$scope.money=queryParam.money;//支付金额
	$scope.mobile=queryParam.mobile;//充值手机号
	$scope.sellPrice=queryParam.sellPrice;//销售价格
	$scope.areaName=queryParam.areaName;//省份
	$scope.carrierName=queryParam.carrierName;//产品类别移动、联通、电信
	$scope.ppiId=queryParam.ppiId;//产品ID
	$scope.payType=queryParam.payType;//支付类型
	$scope.moneys=fmoney($scope.sellPrice,2);

	//点击获取验证码
	$scope.obtainCode=function(){
		$(".submitBut").css("opacity","1");
		$(".messageCode").attr('disabled',"true").css({"background":"#ccc","border":"none","color":"#fff"});
		var parm = {},payPassword="";
    	var encryption="amount="+$scope.money+"&areaName="+$scope.areaName+"&cardNo="+encryptByDES($scope.cardNo)+"&carrierName="+$scope.carrierName+"&customerNo="+$scope.customerNo+"&mobileNo="+encryptByDES($scope.mobile)+"&paychannel=004&payPassword="+encryptByDES(payPassword)+"&payType="+$scope.payType+"&ppiId="+$scope.ppiId+"&sellPrice="+$scope.sellPrice;
		parm.customerNo = $scope.customerNo;//客户号
		parm.sessionId = $scope.sessionId;//令牌号
		parm.mobileNo = encryptByDES($scope.mobile);//手机号
		parm.amount = $scope.money;//缴费金额
		parm.sellPrice = $scope.sellPrice;//销售价格
		parm.payType = $scope.payType;//支付类型
		parm.cardNo = encryptByDES($scope.cardNo);//支付卡号
		parm.ppiId = $scope.ppiId;//产品Id
		parm.areaName = $scope.areaName;// 省份
		parm.carrierName = $scope.carrierName;//产品类别移动、联通、电信 
		parm.payPassword = encryptByDES(payPassword);// 支付密码
		parm.paychannel="002";//代表移动端
		parm.signKey=publicKeyRSA(md5(encryption));
		$.ajax({
			url :getRootPath()+"/ChargingPaymentAction.mobileRechargeCreateBill.do?FAPView=JSON",
			data : parm,
			success : function(data) {
				$(".messageCode").removeAttr("disabled").css({"background":"none","border":"1px solid #333","color":"#333"});//删除点击按钮禁止状态
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.authenticate_status==1){
							//alert(data.data.errMsg);
							$scope.msg = data.data.errMsg;
							$scope.openModalThree();
							setTimeout(function(){
								$scope.closeModalThree();
							},1000*3);
						}else{
							sendMessage();
							var tranflow = data.data.tranflow;
							//点击提交
							$scope.submitBut=function(){
								curCount=0;//当前剩余秒数
								$scope.paySubmit(tranflow);
							};
						}
					}else{
						//alert(data.errors.msg);
						$scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					}
				}else if(data.FAPStatus==2){
					loginH5Host();//请重新登录
				}else{
					//alert(data.FAPErrorMessage);
					$scope.msg = data.FAPErrorMessage;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				};
			},
			error:function(a,b,c){
				$(".messageCode").removeAttr("disabled").css({"background":"none","border":"1px solid #333","color":"#333"});//删除点击按钮禁止状态
				//alert("错误");
			}					
		});
	};
	//点击确认支付
	$scope.paySubmit=function(tranflow){
		$(".submitBut").attr('disabled',"true").css("opacity","0.4");
		var payValidateCode=$(".obtainCode input").val();
		if(payValidateCode==""){
			//alert("验证码不可为空");
			$scope.msg = "验证码不可为空";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}else{
			var encryption="amount="+$scope.money+"&cardNo="+encryptByDES($scope.cardNo)+"&customerNo="+$scope.customerNo+"&mobileNo="+encryptByDES($scope.mobile)+"&payType="+$scope.payType+"&ppiId="+$scope.ppiId+"&sellPrice="+$scope.sellPrice+"&tranFlowNo="+tranflow+"&verificationCode="+encryptByDES(payValidateCode);
	    	var parm = {};
			parm.customerNo = $scope.customerNo;//客户号
			parm.sessionId = $scope.sessionId;//令牌号
			parm.mobileNo = encryptByDES($scope.mobile);//手机号
			parm.amount =$scope.money;//缴费金额
			parm.sellPrice = $scope.sellPrice;//销售价格
			parm.payType = $scope.payType;//支付类型
			parm.cardNo = encryptByDES($scope.cardNo);//支付卡号
			parm.tranFlowNo = tranflow;//交易流水号
			parm.ppiId = $scope.ppiId;//产品ID
			parm.verificationCode = encryptByDES(payValidateCode);//短信验证码
			parm.signKey=publicKeyRSA(md5(encryption));
			$.ajax({
				url :getRootPath()+"/ChargingPaymentAction.mobileRechargeConfirm.do?FAPView=JSON",
				data : parm,
				success : function(data) {
					$(".submitBut").removeAttr("disabled").css("opacity","1");
					var data=$.parseJSON(data);
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							if(data.data.payPaymentStatus==1){
								//alert(data.data.errMsg);
								$scope.msg = data.data.errMsg;
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
							}else{
								var obj = {sellPrice:$scope.sellPrice,goodsInf:data.data.transactionOrderDetail.goodsInf,mobile:$scope.mobile,amount:$scope.money,merchName:data.data.transactionOrderDetail.merchName,createTime:data.data.transactionOrderDetail.createTime,orderNo:data.data.transactionOrderDetail.orderNo,orderStatus:data.data.transactionOrderDetail.orderStatus};
								var jsonObj= angular.toJson(obj);
								$state.go("topUpSuccess",{josnObj:jsonObj})
							}					
						}else{
							//alert(data.errors.msg);
							$scope.msg = data.errors.msg;
							$scope.openModalThree();
							setTimeout(function(){
								$scope.closeModalThree();
							},1000*3);
						}
					}else if(data.FAPStatus==2){
						loginH5Host();//请重新登录
					}else{
						//alert(data.FAPErrorMessage);
						$scope.msg = data.FAPErrorMessage;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					};
				},
				error:function(a,b,c){
					$(".submitBut").removeAttr("disabled").css("opacity","1");
					//alert("错误");
				}					
			});
		}
			
	};


};
angular.module("myapp")
		.controller("payMessageCtrl",['$scope','$stateParams','$state','$ionicModal',payMessageCtrl]);