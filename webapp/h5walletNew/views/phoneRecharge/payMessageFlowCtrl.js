function payMessageFlowCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.customerNameCN=localStorage.getItem("customerNameData");//名字
	$scope.mobile=localStorage.getItem("mobileData");//手机号
	$scope.certNo=localStorage.getItem("certNoData");//身份证号
	
	var queryParam = angular.fromJson($stateParams.jsonPayObj);
	$scope.type=queryParam.type;//充值产品id
	console.log($scope.type);
	if($scope.type =="1"){
		$scope.state = "全国"
	}else if($scope.type =="2"){
		$scope.state = "本地"
	}
	$scope.moneys=queryParam.money;//支付金额
	$scope.cardNo=queryParam.cardNo;//银行卡号
	$scope.bankCardType=queryParam.bankCardType;//充值银行卡信息
	$scope.productId=queryParam.productId;//充值产品ID
	$scope.flow=queryParam.flow;//充值流量大小
	$scope.payType=queryParam.payType;//支付类型
	$scope.mobilePhone = queryParam.mobilePhone;//充值流量的手机号
	console.log(queryParam)
	//点击获取验证码
	$scope.obtainCode=function(){
		$(".submitBut").css("opacity","1");
		$(".messageCode").attr('disabled',"true").css({"background":"#ccc","border":"none","color":"#fff"});
		var parm = {},payPassword="";
    	var encryption="cardNo="+encryptByDES($scope.cardNo)+"&customerNo="+$scope.customerNo+"&flow="+$scope.flow+"&mobileNo="+$scope.mobilePhone+"&paychannel=008&payPassword="+encryptByDES(payPassword)+"&payType="+"26"+"&productId="+$scope.productId+"&type="+$scope.type;

		parm.customerNo = $scope.customerNo;//客户号
		parm.sessionId = $scope.sessionId;//sessionId
		//parm.cardNo = encryptByDES($scope.cardNo);//支付银行卡号
		parm.cardNo = encryptByDES($scope.cardNo);//支付银行卡号
		parm.flow = $scope.flow;//充值流量大小
		parm.mobileNo = $scope.mobilePhone;//充值号码
		parm.payPassword =encryptByDES(payPassword);//支付密码
		parm.payType = "26";//支付类型
		parm.paychannel = "008";//订单来源
		parm.productId = $scope.productId;//充值的产品id
		parm.type = $scope.type;//	漫游属性
		parm.signKey=publicKeyRSA(md5(encryption));//签名
		console.log(encryption)
		console.log(parm.signKey)
		$.ajax({
			url :getRootPath()+"/GagaAction.requestCreateOrder.do?FAPView=JSON",
			data : parm,
			success : function(data) {
				$(".messageCode").removeAttr("disabled").css({"background":"none","border":"1px solid #333","color":"#333"});//删除点击按钮禁止状态
				var data=$.parseJSON(data);
				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.payPaymentStatus==1){//失败
							$scope.msg = data.data.errMsg;
							$scope.openModalThree();
							setTimeout(function(){
								$scope.closeModalThree();
							},1000*3);
							//alert(data.data.errMsg);
						}else{
							sendMessage();
							var tranflow = data.data.tranflow;
							var transactionOrderDetail = data.data.transactionOrderDetail;//返回的信息
							var trxAmount = transactionOrderDetail.trxAmount;//返回的支付金额
							localStorage.setItem("tranflowLiuLiangData",tranflow);//订单流水号
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
					loginH5Host();//从新调登录接口
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
		var payValidateCode=$(".obtainCode input").val();//短信验证码
		console.log(payValidateCode);
		$scope.tranflow = localStorage.getItem("tranflowLiuLiangData");//获取订单流水号

		console.log($scope.tranflow);
		if(payValidateCode==""){
			//alert("验证码不可为空");
			$scope.msg = "验证码不可为空"
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}else{			
	    	var parm = {};		
			parm.amount = $scope.moneys;//支付金额
			parm.cardNo = encryptByDES($scope.cardNo);//银行卡号
			parm.customerNo = $scope.customerNo;//客户号
			parm.flow = $scope.flow;//充值流量大小
			parm.mobileNo = $scope.mobilePhone;//手机号
			parm.payType = $scope.payType;//支付类型
			parm.productId = $scope.productId;//产品id
			//parm.smsCode = encryptByDES(payValidateCode);//短信验证码
			parm.smsCode = payValidateCode;//短信验证码
			parm.tranFlowNo =$scope.tranflow;//订单流水号
			parm.type = $scope.type;//漫游属性（全国为1，本地为2）
			var encryption="amount="+$scope.moneys+"&cardNo="+encryptByDES($scope.cardNo)+"&customerNo="+$scope.customerNo+"&flow="+$scope.flow+"&mobileNo="+$scope.mobilePhone+"&payType="+$scope.payType+"&productId="+$scope.productId+"&smsCode="+payValidateCode+"&tranFlowNo="+$scope.tranflow+"&type="+$scope.type;
			parm.signKey=publicKeyRSA(md5(encryption));
			console.log(encryption);
			console.log(parm.signKey);
			$.ajax({
				url :getRootPath()+"/GagaAction.mobileRechargeConfirm.do?FAPView=JSON",
				data : parm,
				success : function(data) {
					$(".submitBut").removeAttr("disabled").css("opacity","1");
					var data=$.parseJSON(data);
					console.log(data);
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
								var orderStatus = data.data.transactionOrderDetail.orderStatus;//充值状态
								var goodsInf = data.data.transactionOrderDetail.goodsInf;//充值说明
								var money = data.data.transactionOrderDetail.trxAmount;//充值金额
								var rcvCstName = data.data.transactionOrderDetail.rcvCstName//交易对象
								var createTime = data.data.transactionOrderDetail.createTime//创建时间
								var orderNo = data.data.transactionOrderDetail.orderNo//订单号
								var obj = {money:money,mobile:$scope.mobilePhone,orderStatus:orderStatus,goodsInf:goodsInf,rcvCstName:rcvCstName,createTime:createTime,orderNo:orderNo};
								var jsonObj= angular.toJson(obj);
								setTimeout(function(){
		 	    					//$(".mask").hide();
		 	    					$state.go('topUpSuccess',{'josnObj':jsonObj});
		 	    				},2000);
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
						loginH5Host();//从新调登录接口
					}else{
						//alert(data.FAPErrorMessage);
						$scope.msg =data.FAPErrorMessage//;
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
		.controller("payMessageFlowCtrl",['$scope','$stateParams','$state','$ionicModal',payMessageFlowCtrl]);