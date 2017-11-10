function rechfullTimeCardCtrl($scope,$ionicHistory,$state,$stateParams,$ionicModal){
	//$ionicLoading.show();//显示加载指示器
	//全时通卡余额
	$("#balanFullTimeCard-view .balanFullTimeCardImg").attr("src",imgRrc+"h5images/icon_qstcard_yue"+variable+".png")
	$("#rechfullTimeCard-view .rechfullTimeCard .rechargeNum").css("background-image","url("+imgRrc+"h5images/jine"+variable+".png)");
	//全时通卡 背景图片
	//$("#fullTimeCard-view .card").css("background-image","url("+imgRrc+"h5images/ka1"+variable+".png)");
	//$("#fullTimeCard-view .card_top").css("background-image","url("+imgRrc+"h5images/ka2"+variable+".png)");

	$("#fullTimeCard-view .transDetail img").attr("src",imgRrc+"h5images/icon_kashu_qstcard"+variable+".png");
	$("#fullTimeCard-view .addFullCard").css("background-image","url("+imgRrc+"h5images/icon_addqstcard"+variable+".png)");
	$("#fullTimeCard-view .noneCard").css("background-image","url("+imgRrc+"h5images/icon_wuka"+variable+".png)");

	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.certNo =localStorage.getItem("certNoData"); //身份证号
 	//console.log($scope.certNo);
	//获取url中的参数信息
	var queryParam = angular.fromJson($stateParams.josnObj);
	//console.log(queryParam);
	$scope.certNo = queryParam.certNo;//身份证号
	$scope.mobileNo = queryParam.mobileNo;//手机号
	$scope.customerNameCN = queryParam.customerNameCN;//姓名
	//全时通卡 空参数
	$scope.fullCardNo = queryParam.fullCardNo;//全时通卡卡号
	$scope.bankCardType = queryParam.bankCardType;//首页空的银行卡号
	$scope.cardNo = queryParam.cardNo;//判断银行卡是否为空
	$scope.fullCardNum = $scope.fullCardNo.substr(15,4); //全时通卡后四位
	//console.log(queryParam);
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
				console.log("------支付方式-------");
				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						var bankcard_list = data.data.bankcard;//银行卡列表
						var cdcard_list = data.data.cdcard;//全时通卡列表
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
							if($scope.cardNo == "" & $scope.bankCardType ==""){
								$scope.fullCardNum = $scope.fullCardNo.substr(15,4); //全时通卡后四位
								console.log($scope.fullCardNum);
								$scope.BANKNAME = bankcard_list[0].BANKNAME;//哪家银行
								$scope.CARDNAME = bankcard_list[0].CARDNAME;//卡类型
								$scope.bankCardNum = bankcard_list[0].ACCOUNTNO;//卡号
								//卡号后四位
								$scope.ACCOUNTNO = bankcard_list[0].ACCOUNTNO.substring(bankcard_list[0].ACCOUNTNO.length-4,bankcard_list[0].ACCOUNTNO.length);
								$(".payCardlist_card span").text($scope.BANKNAME+$scope.CARDNAME+'('+$scope.ACCOUNTNO+')');
								console.log($scope.BANKNAME)
							}else{
								$scope.bankCardNum = $scope.cardNo;//银行卡号
								$scope.fullCardNum = $scope.fullCardNo.substr(15,4);//全时通卡卡号
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
				alert("错误");
			}					
		});
	};
	$scope.paymentMethod();

	//更改按钮 跳转到支付方式列表
	$scope.changeCard = function(){//dataType=5 money payType=3  
		var topUpAmount = $("#pre_money").val();//金额
		var CardObj = {cardNo:$scope.cardNo,fullCardNo:$scope.fullCardNo,bankCardType:$scope.bankCardType,certNo:$scope.certNo,mobile:$scope.mobileNo,customerNameCN:$scope.customerNameCN,dataType:"5",money:topUpAmount,payType:"3"} 
		var josnObj= angular.toJson(CardObj);
		console.log(josnObj);
		$state.go('fullCardPayMethod',{'josnObj':josnObj});
	};
	//下一步按钮
	$scope.nextPhoneCode = function(){
		//充值金额正则表达式
		var rules_money =/^\d+(\.\d+)?$/;
		var topUpAmount = $("#pre_money").val();
		var isMoney = rules_money.test(topUpAmount);
		if($("#pre_money").val() == ""){
			$scope.msg = "充值金额不可为空"
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}else{
			if(isMoney == true){
				$(".topUpAmount").val(fmoney(topUpAmount,2));
				$("#rechfullTimeCard-view .balanceRecharge").css("display","none");
				$("#rechfullTimeCard-view .phoneMessage").css("display","block");
			}else{
				$scope.msg = "金额格式错误"
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}
		};	
	};
	//全时通卡往账户充值 发送短信验证码
	$scope.balanceRechargeCode = function(){
		var topUpAmount = $("#pre_money").val();//金额
		var cardAccountNo = $(".bankCardHao").text();//银行卡
		//console.log(cardAccountNo);
		var encryption="accountNo="+encryptByDES(cardAccountNo)+"&cardNo="+encryptByDES($scope.fullCardNo)+"&channelType=005&customNo="+$scope.customerNo+"&initAmt="+topUpAmount+"&payType=26";
		if(true){
			var parms = {};
			parms.customNo = $scope.customerNo;//客户号
			parms.sessionId = $scope.sessionId;//令牌号
			parms.cardNo = encryptByDES($scope.fullCardNo);//全时通卡卡号
			parms.initAmt = topUpAmount;//金额
			parms.channelType = "005";
			parms.accountNo = encryptByDES(cardAccountNo);//银行卡号
			parms.payType = "26";
			parms.signKey=publicKeyRSA(md5(encryption));
			console.log(encryption);
			console.log(cardAccountNo);
			$.ajax({
				url :getRootPath()+"/PublicPayAction.cardRechargeByQuick.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success:function(data){
					var data = $.parseJSON(data);
					console.log(data);
					if(data.FAPStatus == 0){
						if(data.success == true){
							if(data.data.authenticateStatus == 1){
								$scope.msg = data.data.errMsg;
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
							}else{
								sendMessage();
								var order_no = data.data.orderno;
								var flowno = data.data.flowno;
								$(".orderNo").text(order_no);//订单流水号
								$(".flowno").text(flowno);
							}
						}else{
							$scope.msg = data.errors.msg;
							$scope.openModalThree();
							setTimeout(function(){
								$scope.closeModalThree();
							},1000*3);
						}
					}else if(data.FAPStatus==2){
						//$("#mark_one").css("display","block").find(".text").text("请重新登录");
						loginH5Host();
						$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    		window.location.href="./index.html";
				    	})
					}else{
						$scope.msg = data.FAPErrorMessage;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					};
				},
				error:function(a,b,c){
					//alert("错误");
				}
			});
		}
	};
	//确认付款
	$scope.ConfirmPay = function(){
	 	curCount=0;
	    var message_code = $(".getCode .msgCode").val();//手机验证码
	 	var cardAccountNo = $(".bankCardHao").text();//银行卡号
	 	var orderNo = $(".orderNo").text();//
	 	var flowno=$(".flowno").text();//
	 	//console.log(orderNo);
	 	//console.log(flowno);
	 	var topUpAmount = $("#pre_money").val();//金额
	 	var encryption;
	 	encryption ="accountNo="+encryptByDES(cardAccountNo)+"&amount="+topUpAmount+"&customerNo="+$scope.customerNo+"&orderSerialNo="+orderNo+"&payValidateCode="+encryptByDES(message_code);
	 	if(message_code!==""){
	 		if(orderNo == ""){
	 			$scope.msg = "请点击获取短信验证码";
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
	 		}else{
	 			var parms = {};	 
	 			var encryption="cardNo="+encryptByDES($scope.fullCardNo)+"&customNo="+$scope.customerNo+"&flowno="+flowno+"&orderno="+orderNo+"&payValidateCode="+encryptByDES(message_code)+"&recordedBank="+encryptByDES(cardAccountNo);
	 			parms.customNo = $scope.customerNo;//客户号
				parms.sessionId = $scope.sessionId;//令牌号
				parms.cardNo = encryptByDES($scope.fullCardNo);//全时通卡号
				parms.orderno = orderNo ;
				parms.flowno = flowno;
				parms.payValidateCode = encryptByDES(message_code) ;//验证码
				parms.recordedBank = encryptByDES(cardAccountNo) ;//银行卡号
				parms.signKey=publicKeyRSA(md5(encryption));
				//console.log(parms.signKey);
	 			//console.log(amount);
	 			$.ajax({
		 			url :getRootPath()+"/PublicPayAction.payMentAuth.do?FAPView=JSON",
		 			type: 'post',
		 			data : parms,
		 			success : function(data) {
		 				var data=$.parseJSON(data);
		 				console.log("-----银行卡 往全时通卡充值-------");
		 				console.log(data);
		 				if(data.FAPStatus==0){
		 					if(data.success==true){
								if(data.data.tradeStatus==0){
									$scope.msg = "全时通卡余额充值成功";
									$scope.openModalThree();
									setTimeout(function(){
										$scope.closeModalThree();
									},1000*3);
									var objfull = {certNo:$scope.certNo,mobileNo:$scope.mobileNo,customerNameCN:$scope.customerNameCN};
									var josnObj= angular.toJson(objfull);
									$ionicHistory.clearCache();
									$state.go('fullTimeCard',{'josnObj':josnObj});
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
							// $("#mark_one").css("display","block").find(".text").text("请重新登录");
					  //   	$(".change").off("click").live("click",function(){
					  //   		$("#mark_one").css("display","none");
					  //   		window.location.href="./index.html";
					  //   	});
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
	 		}
	 	}else{
			$scope.msg = "短信验证码不能为空";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
	 	}
	};
		  

	// //添加按钮 跳转到添加银行卡
	// $scope.addBankView = function(){
	// 	var accountObj = {customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo} 
	// 	var jsonAccountObj= angular.toJson(accountObj);
	// 	console.log(jsonAccountObj);
	// 	$state.go('addBank',{'josnObj':jsonAccountObj});
	// };
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
		.controller("rechfullTimeCardCtrl",['$scope','$ionicHistory','$state','$stateParams','$ionicModal',rechfullTimeCardCtrl]);