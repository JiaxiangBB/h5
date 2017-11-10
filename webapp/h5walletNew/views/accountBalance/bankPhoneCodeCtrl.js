function bankPhoneCodeCtrl($scope,$ionicHistory,$state,$stateParams,$ionicModal){
	//$ionicLoading.show();//显示加载指示器
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.certNo =localStorage.getItem("certNoData"); //身份证号
	//账户余额
	$("#accountBalance-view .accountBalanceImg").attr("src",imgRrc+"h5images/icon_jinegai_yellow"+variable+".png");
	$("#paymentMethod-view .paymentMethod .cardImg01").css("background-image","url("+imgRrc+"h5images/icon_bank_zgnyyh"+variable+".png)")
	$("#paymentMethod-view .paymentMethod .cardImg02").css("background-image","url("+imgRrc+"h5images/icon_bank_zgnyyh"+variable+".png)")
	$("#paymentMethod-view .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");
	$("#bankPhoneCode-view .bankPhoneCode .rechargeNum").css("background-image","url("+imgRrc+"h5images/jine"+variable+".png)");

	//获取url中的参数信息
	var queryParam = angular.fromJson($stateParams.jsonAccountObj);
	$scope.mobileNo = queryParam.mobileNo;//手机号
	$scope.certType = queryParam.certType;//是否实名
	$scope.customerNameCN = queryParam.customerNameCN;//姓名
	$scope.certNo = queryParam.certNo;//身份证号
	$scope.accountBalance = queryParam.accountBalance;//账户余额

	var accountObj = {customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo,accountBalance:$scope.accountBalance};
	var jsonAccountObj= angular.toJson(accountObj);

	//卡号 参数
	var queryParamJsonPayObj = angular.fromJson($stateParams.jsonPayObj);
	$scope.cardNo = queryParamJsonPayObj.cardNo;//卡号
	$scope.money = queryParamJsonPayObj.money;
	$scope.bankCardType = queryParamJsonPayObj.bankCardType;//银行卡类型信息
	console.log(queryParamJsonPayObj)
	console.log($scope.bankCardType);

	var payObj={cardNo:$scope.cardNo,money:$scope.money,bankCardType:$scope.bankCardType};
	var jsonPayObj = angular.toJson(payObj);
	//初始化银行卡信息
	//首页 充值按钮 支付方式 初始化 PrepaidCardAction.cardQuery
	$scope.paymentMethod =  function(){
		var parm = {};
		parm.customerNo = $scope.customerNo;//客户号
		//初始化支付方式银行卡信息
		$.ajax({
			url :getRootPath()+"/PrepaidCardAction.cardQuery.do?FAPView=JSON",
			type: 'post',
			data : parm,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log("------支付方式-------");
				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						var bankcard_list = data.data.bankcard;
						var cdcard_list = data.data.cdcard;
						var bankcard_list_lenght = data.data.bankcard.length;
						//var bankcard_list_lenght = 0;
						//console.log(bankcard_list_lenght);
						if(bankcard_list_lenght == 0){
							$(".payCardlist_null").css("display","block");
							$(".payCardlist_card").css("display","none");
							//添加按钮 跳转到添加银行卡
							$scope.addBankView = function(){
								if($scope.certNo == ""){
										$scope.msg = "请先实名认证";
										$scope.openModalThree();
										setTimeout(function(){
											$scope.closeModalThree();
										},1000*3);
									}else{
										var accountObj = {customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo} 
										var jsonAccountObj= angular.toJson(accountObj);
										console.log(jsonAccountObj);
										$state.go('addBank',{'josnObj':jsonAccountObj});
										//$state.go('addBank');
									}	
							};
						}else{
							$(".payCardlist_null").css("display","none");
							$(".payCardlist_card").css("display","block");
							if($scope.cardNo ==""&$scope.bankCardType ==""){
								$scope.BANKNAME = bankcard_list[0].BANKNAME;//哪家银行
								$scope.CARDNAME = bankcard_list[0].CARDNAME;//卡类型
								$scope.cardNum = bankcard_list[0].ACCOUNTNO;//卡号
								//卡号后四位
								$scope.ACCOUNTNO = bankcard_list[0].ACCOUNTNO.substring(bankcard_list[0].ACCOUNTNO.length-4,bankcard_list[0].ACCOUNTNO.length);
								$(".payCardlist_card span").text($scope.BANKNAME+$scope.CARDNAME+'(尾号'+$scope.ACCOUNTNO+')');
							}else{
								// $scope.BANKNAME = bankcard_list[0].BANKNAME;//哪家银行
								// $scope.CARDNAME = bankcard_list[0].CARDNAME;//卡类型
								// $scope.cardNum = bankcard_list[0].ACCOUNTNO;//卡号
								$scope.cardNum = $scope.cardNo;//卡号
								//console.log($scope.cardNum);jsonPayObj
								$(".payCardlist_card span").text($scope.bankCardType);
							};

						}
					}else{
						$scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					}
				}else if(data.FAPStatus==2){
					loginH5Host();//请重新登录
				}else{
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
	};
	$scope.paymentMethod();

	//更改按钮 跳转到支付方式列表
	$scope.changeCard = function(){//dataType=5 money payType=2  
		var topUpAmount = $("#pre_money").val();//金额
		var accountObj = {customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo,dataType:"5",money:topUpAmount,payType:"2"} 
		var jsonAccountObj= angular.toJson(accountObj);
		console.log(jsonAccountObj);
		$state.go('paymentMethod',{'josnObj':jsonAccountObj});
	};

	//点击下一步
	$scope.balanceRechargeNext = function(){
		//充值金额正则表达式
		var rules_money =/^\d+(\.\d+)?$/;
		var topUpAmount = $("#pre_money").val();
		console.log(topUpAmount);
		var isMoney = rules_money.test(topUpAmount);
		console.log(isMoney);
		if($("#pre_money").val() == ""){
			$scope.msg = "充值金额不可为空"
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}else{
			if(isMoney == true){
				$(".topUpAmount").val(fmoney(topUpAmount,2));
				$("#bankPhoneCode-view .balanceRecharge").css("display","none");
				$("#bankPhoneCode-view .phoneMessage").css("display","block");
			}else{
				$scope.msg = "金额格式错误"
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}
		};
	};

	//银行卡往账户充值 发送短信验证码
	$scope.balanceRechargeCode = function(){
		//alert("jkjhjkhjg");
		var topUpAmount = $("#pre_money").val();//金额
		var cardAccountNo = $(".cardNum").text();//卡号
		console.log(cardAccountNo);
		var encryption;
		encryption ="accountNo="+encryptByDES(cardAccountNo)+"&amount="+topUpAmount+"&channelType=005&customerNo="+$scope.customerNo+"&payType=26";
		if(true){
			var parms = {};
			parms.channelType= "005";//渠道来源
			parms.payType= "26";//支付类型
			parms.customerNo= $scope.customerNo;//客户号
			parms.amount= topUpAmount;//金额
			parms.accountNo= encryptByDES(cardAccountNo);//银行卡号
			parms.sessionId= $scope.sessionId;//sessionId
			parms.signKey=publicKeyRSA(md5(encryption));
			//console.log(parms.signKey);
			$.ajax({
				url :getRootPath()+"/ThridPayAccountAction.bankCardRechargeByQuick.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					//$(".paySendPhoneMessage").removeAttr("disabled");//删除点击按钮禁止状态
					var data=$.parseJSON(data);
					//console.log("-----发送短信验证码----");
					console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							sendMessage();
							$scope.order_no = data.data.order_no;//订单流水号
							console.log($scope.order_no);
							$(".getCode .orderNum").text($scope.order_no);
							if(data.data.authenticate_status==1){
								$scope.msg = data.data.errMsg;
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
								//$("#mark_one").css("display","block").find(".text").text(data.data.errMsg);
							}else{
								$scope.msg = data.data.errMsg;
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
							}
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
						$scope.msg = data.data.errMsg;
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
		}else{
		}
	};
	//确认付款
	$scope.ConfirmPay = function(){
		curCount=0;
	    var message_code = $(".getCode .msgCode").val();//手机验证码
		var cardAccountNo = $(".cardNum").text();//卡号
		var orderNo = $(".getCode .orderNum").text();//订单流水号
		var topUpAmount = $("#pre_money").val();//金额
		var encryption;
		encryption ="accountNo="+encryptByDES(cardAccountNo)+"&amount="+topUpAmount+"&customerNo="+$scope.customerNo+"&orderSerialNo="+orderNo+"&payValidateCode="+encryptByDES(message_code);
		if(message_code!==""){
			var parms = {};		
			parms.customerNo =$scope.customerNo;//客户号
			parms.orderSerialNo = orderNo;//订单流水号
			parms.sessionId = $scope.sessionId;//令牌号
			parms.accountNo = encryptByDES(cardAccountNo);//银行卡号
			parms.payValidateCode= encryptByDES(message_code);//短信验证码
			parms.amount=topUpAmount;//金额
			parms.signKey=publicKeyRSA(md5(encryption));
			//console.log(parms.signKey);
			//console.log(amount);
			$.ajax({
				url :getRootPath()+"/ThridPayAccountAction.bankCardRechargeByQuickConfirm.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					console.log("-----银行卡 往账户余额充值-------");
					console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							if(data.data.tradeStatus==0){
								$scope.msg = "账户余额充值成功";
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
								$state.go('accountBalance',{'jsonAccountObj':jsonAccountObj,'jsonPayObj':jsonPayObj});
							}else if(data.data.tradeStatus==1){
								$scope.msg = "交易正在处理";
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
							}else{
								$scope.msg = data.data.errMsg;
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
							}
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
		}else{
			$scope.msg = "短信验证码不能为空";
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
		.controller("bankPhoneCodeCtrl",['$scope','$ionicHistory','$state','$stateParams','$ionicModal',bankPhoneCodeCtrl]);
