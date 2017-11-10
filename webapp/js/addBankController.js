function addBank($scope,$rootScope,$location,$state,$stateParams){
	//获取wrap页面的参数         
	//解析url参数     wrap页面    publicStr
	var obj="";
	var str = $stateParams.publicStr;
	if(str==""){
		
	}else{
		var privateStr=privateKey(str);
		obj=angular.fromJson(privateStr);
	}
	
   $scope.customerNo = obj.customerNo;
   $scope.sessionId = obj.sessionId; 
   $scope.mobile = obj.mobile;
   $scope.customerNameCN = obj.customerNameCN;
   $scope.payPwdFlag = obj.payPwdFlag;//是否设置支付密码
   $scope.password = obj.password;//登录密码
   $scope.lastLogonTime = obj.lastLogonTime;//最后一次登录时间
   //解析url参数    二级页面    moneyStr
   var mstr = $stateParams.moneyStr;
   var mprivateStr=privateKey(mstr);
   //console.log(mprivateStr)
   var mobj=angular.fromJson(mprivateStr);
   $scope.balance_wrap = mobj.balance_wrap;//转账页面显示 账户余额
   $scope.accountBalance = mobj.accountBalance;
   $scope.quanShiCard=mobj.quanShiCard;
 
   //定义全局变量
   var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
	var publicStr=publicKey(str);
	var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}';
	var moneyStr=publicKey(mstr);
	
	//点击弹框关闭按钮
	 $scope.close=function(){
		$("#mark_one").css("display","none");
		$("#mark_two").css("display","none");
		$("#description").css("display","none");
	 };
	
	//忘记支付密码调用
	 $scope.forget_payPassword = function(){
		 $scope.toresetPsw(publicStr,moneyStr);
	 };
	
	//添加全时通卡章程 弹框
	$scope.constitution = function(){
		$("#mark_constitution").css("display","block");
	};
	//弹框 关闭按钮
	$scope.closeadd = function(){
		$("#mark_constitution").css("display","none");
	};
	
	//判断是否实名  执行填卡操作
	if($scope.customerNameCN=="未实名"){
		$(".add_card").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以添加全时通卡");
	    	$(".change").text("立即认证");
	    });
	    $(".add_bank").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以添加银行卡");
	    	$(".change").text("立即认证");
	    });
	     //实名认证调用
		 $scope.read_name=function(){
		    $scope.toapprove(publicStr,moneyStr);
		 }; 
	}else{
		if($scope.payPwdFlag=="1"){
			//添加全时通卡调用
		    $scope.add_cards=function(){
		    	$scope.toAdd(publicStr,moneyStr);
		    }; 
		    //添加银行卡调用
		    $scope.add_banks=function(){
		    	$scope.toaddBank(publicStr,moneyStr);
		    }; 
		}else{
			$(".add_card").off("click").live("click",function(){
		    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以添加全时通卡");
		    	$(".change").text("立即设置");
		    });
		    $(".add_bank").off("click").live("click",function(){
		    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以添加银行卡");
		    	$(".change").text("立即设置");
		    });
		    //设置支付密码调用
		    $scope.read_name=function(){
			    $scope.topayPassword(publicStr,moneyStr);
			 }; 
		}
		 
	}
	//首页 充值按钮 支付方式 初始化 PrepaidCardAction.cardQuery
	$scope.paymentMethod =  function(){
		if(true){
			var parms = {};
			
			parms.customerNo = $scope.customerNo;//客户号
			element=".payCardlist_card";
			pub(parms,element);
		}
	};
	 var rules_money =/^\d+(\.\d+)?$/,topUpAmount;
	//账户 充值金额 
	  $scope.prepaid_next = function(){
		  topUpAmount = $("#pre_money").val();//充值金额
		  var isMoney = rules_money.test(topUpAmount);
		 //console.log(topUpAmount);
		 //console.log(isMoney);
		  if($("#pre_money").val()==""){
			  $("#mark_one").css("display","block").find(".text").text("充值金额不可为空");
		  }else{
			  if(isMoney==true){
				  $(".topUpAmount").text(fmoney(topUpAmount,2));
				//账户充值 支付方式 初始化 方法调用
				  $scope.paymentMethod();
				  $(".recharge_money_one").css("display","none");
				  $(".prepaid_money").css("display","block");
				  $(".prepaidBank").show().siblings().hide();
				  $(".prepaidBank").off("click").on("click",function(){
					  $(".payCardlist_card").html("");
					  $(".recharge_money_one").css("display","block");
					  $(".prepaid_money").css("display","none");
					  $(this).hide().siblings().show();
				  });
			  }else{
				  $("#mark_one").css("display","block").find(".text").text("金额格式错误");
			  } 
		  }
	  };
	//var amount="";
	//充值 --- 发送短信验证码 ThridPayAccountAction.bankCardRechargeByQuick
	$(".paySendPhoneMessage").off("click").on("click",function(){
		$(this).attr('disabled',"true");
		curCount=0;//当前剩余秒数
		numBer=0;//判断是否显示重新获取
		var cardAccountNo = $('input[name="payCard"]:checked').val();//卡号
		//console.log(topUpAmount)
		var encryption;
			encryption ="accountNo="+encryptByDES(cardAccountNo)+"&amount="+topUpAmount+"&channelType=005&customerNo="+$scope.customerNo+"&payType=26";
			//console.log(encryption);
			//console.log(md5(encryption));
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
					$(".paySendPhoneMessage").removeAttr("disabled");//删除点击按钮禁止状态
					var data=$.parseJSON(data);
					//console.log("-----发送短信验证码----");
					console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							if(data.data.authenticate_status==1){
								$("#mark_one").css("display","block").find(".text").text(data.data.errMsg);
							}else{
								var amount=data.data.amount;
								sign();
								var order_no = data.data.order_no;
								$(".orderNo").text(order_no);
							}
						}else{
							$("#mark_one").css("display","block").find(".text").text(data.errors.msg);
							$(".change").off("click").live("click",function(){
					    		$("#mark_one").css("display","none");
					    	});
						}
					}else if(data.FAPStatus==2){
						$("#mark_one").css("display","block").find(".text").text("请重新登录");
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    		window.location.href="./index.html";
				    	});
					}else{
						$("#mark_one").css("display","block").find(".text").text(data.FAPErrorMessage);
						$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    	});
					}
				},
				error:function(a,b,c){
				//	alert("错误");
				}
			});
		}else{
		}
	});
	
	//银行卡 往账户余额充值 确认 ThridPayAccountAction.bankCardRechargeByQuickConfirm
	$scope.bankCardRecharge = function(){
		curCount=0;
		var cardAccountNo =  $('input[name="payCard"]:checked').val();//卡号
		var orderNo = $(".orderNo").text();//订单流水号
		var message_code = $(".message_code").val();//短信验证码
		//console.log(orderNo);
		var encryption;
			encryption ="accountNo="+encryptByDES(cardAccountNo)+"&amount="+topUpAmount+"&customerNo="+$scope.customerNo+"&orderSerialNo="+orderNo+"&payValidateCode="+encryptByDES(message_code);
			//console.log(encryption);
			//console.log(md5(encryption));
		if(message_code!=""){
			
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
					//console.log("-----银行卡 往账户余额充值-------");
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							if(data.data.tradeStatus==0){
								$("#mark_two").css("display","block");
								$scope.toWrap=function(){
									$("#mark_two").css("display","none");
									$scope.toMain(publicStr);
								};
							}else if(data.data.tradeStatus==1){
								$("#mark_one").css("display","block").find(".text").text("交易正在处理");
								$(".change").off("click").live("click",function(){
						    		$("#mark_one").css("display","none");
						    		$scope.toMain(publicStr);
						    	});
							}else{
								$("#mark_one").css("display","block").find(".text").text(data.data.errMsg);
								$(".change").off("click").live("click",function(){
						    		$("#mark_one").css("display","none");
						    	});
							}
						}else{
							$("#mark_one").css("display","block").find(".text").text(data.errors.msg);
							$(".change").off("click").live("click",function(){
					    		$("#mark_one").css("display","none");
					    	});
						}
					}else if(data.FAPStatus==2){
						$("#mark_one").css("display","block").find(".text").text("请重新登录");
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    		window.location.href="./index.html";
				    	});
					}else{
						$("#mark_one").css("display","block").find(".text").text(data.FAPErrorMessage);
						$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    	});
					}
				},
				error:function(a,b,c){
				//	alert("错误");
				}					
			});
		}else{
			$("#mark_one").css("display","block").find(".text").text("验证码不可为空");
		}	
	};
	//账户 转账
	  $scope.transfer_next = function(){
		  var other_phoneNumber = $("#phone_number").val();//对方账户
		  var other_phoneNumberAgain = $("#other_phoneNumberAgain").val();//请再次输入对方手机号
		  var transferAmount = $("#pre_money").val();//转账金额
		  var transferInstructions = $("#transferInstructions").val();//转账说明
		  var payPassword_transfer = $(".payPassword_transfer").val();//支付密码
		  var rules_phone = /^1[34578][0-9]{9}$/;
		  var isTel= rules_phone.test(other_phoneNumber);
		  var isMoney = rules_money.test(transferAmount);
		  if($("#other_phoneNumber").val()=="" || $("#other_phoneNumberAgain").val()=="" || $("#transferAmount").val()==""){
			  $("#mark_one").css("display","block").find(".text").text("转账信息不可为空");
		  }else{
			  if(isTel==true){
				  if(isMoney==true){
					  if(other_phoneNumber==other_phoneNumberAgain){
						  $(".trans").text(fmoney(transferAmount,2));
						  var parms = {};
							parms.customerNo = $scope.customerNo;//客户号
							parms.sessionId = $scope.sessionId;//令牌号
							parms.userName = other_phoneNumber;//收款用户名
							parms.userType = "p";
							$.ajax({
								url :getRootPath()+"/CustomerAction.userCheck.do?FAPView=JSON",
								type: 'post',
								data : parms,
								success : function(data) {
									var data=$.parseJSON(data);
									//console.log("---------转账--------");
									//console.log(data);
									if(data.FAPStatus==0){
										if(data.success==true){
											if(data.data.authstatus=="0"){
												$("#mark_one").css("display","block").find(".text").text("对方账户未实名");
											}else{
												$scope.userName=data.data.userName;
												$(".recharge_money_one").css("display","none");
												$(".transfer_money").css("display","block");
												$(".transferBank").show().siblings().hide();
												$(".transferBank").off("click").on("click",function(){
													$(this).hide().siblings().show();
													$(".recharge_money_one").css("display","block");
													$(".transfer_money").css("display","none");
												})
											}
										}else{
											$("#mark_one").css("display","block").find(".text").text(data.errors.msg);
										}
									}else if(data.FAPStatus==2){
										$("#mark_one").css("display","block").find(".text").text("请重新登录");
								    	$(".change").off("click").live("click",function(){
								    		$("#mark_one").css("display","none");
								    		window.location.href="./index.html";
								    	})
									}else{
										$("#mark_one").css("display","block").find(".text").text(data.FAPErrorMessage);
									}
								},
								error:function(a,b,c){
								//	alert("错误");
								}					
							});
					  }else{
						  $("#mark_one").css("display","block").find(".text").text("两次输入账户不同");
					  }
				  }else{
					  $("#mark_one").css("display","block").find(".text").text("输入金额格式错误");
				  }
			  }else{
				  $("#mark_one").css("display","block").find(".text").text("输入手机号格式错误");
			  }
			  
		  }
	  };
	//首页 账户余额 转账接口 TransactionAction.accTransfer
	$scope.balanceTransfers = function(){
		var other_phoneNumber = $("#phone_number").val();//对方账户
		var transferAmount = $("#pre_money").val();//转账金额
		var payPassword_transfer = $(".payPassword_transfer").val();//支付密码
		
		var encryption="amount="+transferAmount+"&customerNo="+$scope.customerNo+"&mobileNo=&password="+encryptByDES(payPassword_transfer)+"&recAcc="+encryptByDES(other_phoneNumber)+"&remark="+$("#transferInstructions").val()+"&smsCode=&smsFlg=0&touchID=&verifyCode=";
		  	console.log(encryption);
		  	console.log(md5(encryption));
		if(true){
			var parms = {};
			parms.customerNo = $scope.customerNo;//客户号
			parms.sessionId = $scope.sessionId;//令牌号
			parms.recAcc = encryptByDES(other_phoneNumber);//收款用户名
			parms.amount = transferAmount;//转账金额
			parms.password = encryptByDES(payPassword_transfer);//转账密码  支付密码
			parms.smsFlg = 0;//发短信标志
			parms.remark=$("#transferInstructions").val();//备注
			parms.mobileNo="";
			parms.smsCode="";
			parms.touchID="";
			parms.verifyCode="";
			parms.signKey=publicKeyRSA(md5(encryption));
			//console.log(parms.signKey);
			
			$.ajax({
				url :getRootPath()+"/TransactionAction.accTransfer.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					console.log("---------转账提交--------");
					console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							$("#mark_two").css("display","block");
					    	$(".true").off("click").live("click",function(){
					    		$("#mark_two").css("display","none");
					    		$scope.toMain(publicStr);
					    	});
						}else{
							$("#mark_one").css("display","block").find(".text").text(data.errors.msg);
						}
					}else if(data.FAPStatus==2){
						$("#mark_one").css("display","block").find(".text").text("请重新登录");
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    		window.location.href="./index.html";
				    	});
					}else{
						$("#mark_one").css("display","block").find(".text").text(data.FAPErrorMessage);
					}
				},
				error:function(a,b,c){
				//	alert("错误");
				}					
			});
		}else{
		}	
	};
	//提现页面 储蓄卡列表 初始化数据
	$scope.withdrawalCashCard = function(){
		if(true){
			var parms = {};
			parms.customerNo = $scope.customerNo;//客户号
			element=".withdrawal_CashCard_card";
			pub(parms,element);
		}
	};
	$scope.withdrawalCashCard();//调用
	//账户余额 提现
	$scope.accountWithdrawal = function(){
		var cardAccountNo = $('input[name="payCard"]:checked').val();//卡号
		var balance_tixian = $(".balance_tixian").text();//提现金额
		var tixian_password = $(".tixian_password").val();//支付密码
		if(true){
			var parms = {};
			parms.customerNo = $scope.customerNo;//客户号
			parms.sessionId = $scope.sessionId;//令牌号
			parms.bankId = 104;//银行号
			parms.accountNo = cardAccountNo;//银行账号
			parms.amount = balance_tixian;//提现金额
			parms.password = tixian_password;//支付密码
			$.ajax({
				url :getRootPath()+"/TransactionAction.accWithdrawCash.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log("------账户余额 提现-------");
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							if(data.data.BANKTYPE==1){
								$("#mark_one").css("display","block").find(".text").text("信用卡不支持提现功能 ");
							}else{
								$("#mark_one").css("display","block").find(".text").text("您已成功从账户提现"+balance_tixian+"元");
								$(".change").off("click").live("click",function(){
						    		$("#mark_one").css("display","none");
						    		$scope.toMain(publicStr);
						    	});
							}
						}else{
							$("#mark_one").css("display","block").find(".text").text(data.errors.msg);
						}
					}else if(data.FAPStatus==2){
						$("#mark_one").css("display","block").find(".text").text("请重新登录");
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    		window.location.href="./index.html";
				    	});
					}else{
						$("#mark_one").css("display","block").find(".text").text(data.FAPErrorMessage);
					}
				},
				error:function(a,b,c){
//					alert("错误");
				}					
			});
		}else{
		}
	};
	//添加全时通卡
	$scope.addFullCard = function(){
		var cardNumber = $(".cardNumber").val();//全时通卡卡号
		var cardPassword = $(".cardPassword").val();//卡密码  	
		if(cardNumber!="" && cardPassword!=""){
			  if($(".form_group .agree").attr("checked")){
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
							//console.log(data);
							if(data.FAPStatus==0){
								if(data.success==true){
									$(".error_message").css("opacity","0");
									$("#mark_one").css("display","block").find(".text").text("您的全时通卡已添加成功");
							    	$(".change").off("click").live("click",function(){
							    		$("#mark_one").css("display","none");
							    		$scope.toMain(publicStr);
							    	});
								}else{
									$(".error_message").css("opacity","1");
									$(".error_message").find("b").text(data.errors.msg);
								}
							}else if(data.FAPStatus==2){
								$("#mark_one").css("display","block").find(".text").text("请重新登录");
						    	$(".change").off("click").live("click",function(){
						    		$("#mark_one").css("display","none");
						    		window.location.href="./index.html";
						    	});
							}else{
								$(".error_message").css("opacity","1");
								$(".error_message").find("b").text(data.FAPErrorMessage);
							}
						},
						error:function(a,b,c){
						//	alert("错误");
						}					
					});
				}else{
					$(".error_message").css("opacity","1");
					$(".error_message").find("b").text("请先阅读全时通卡章程");
				}
		}else{
			$(".error_message").css("opacity","1");
			$(".error_message").find("b").text("全时通卡号及密码不可为空");
		}

	
	  };
	//全时通卡列表页面 初始化数据
	$scope.cardList = function(){
	  if(true){
			var parms = {};
			parms.customerNo = $scope.customerNo;//客户号
			parms.sessionId = $scope.sessionId;//令牌号
			parms.beginPos = 1;//起始位置
			parms.pageSize = 10;//页面记录数
			$.ajax({                    
				url :getRootPath()+"/AccountAction.preCardListQuery.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							$scope.resultQshi = data.data.perPreCardInfList.result;
							$scope.$apply();
							//循环显示全时通卡背景
							var i=0;
							for(var j=0;j<$scope.resultQshi.length;j++){
								//显示金额样式
								var cardNo=$scope.resultQshi[j].cardNo;
								var intercept=cardNo.substr(6,9);
								var interceptCardno=cardNo.substr(0,6)+intercept.replace(intercept,"*********")+cardNo.substr(15,4);
								//显示金额样式
								$(".list_main ul li").eq(j).find("h2").text(fmoney($scope.resultQshi[j].aifavabalance,2));
								$(".list_main ul li").eq(j).find(".cardNumberQshi").text(interceptCardno);
								$(".list_main ul li").eq(j).find(".cardNumberQshiNum").text(cardNo);
								if(j>=5){
									i=0;
								}else{
									i++;
								}
								$(".list_main ul .QshiCard").eq(j).css({"background-image":"url("+$rootScope.imagesSRC+"card/ka"+(i)+".png)","background-repeat":"no-repeat","background-size":"cover"});
							}
							//全时通卡充值调用
						    $(".card_recharge").off("click").live("click",function(){
						    	var bgImg=$(this).parent("li").css('backgroundImage');
						    	var aifavabalance=$(this).parent("li").find("h2").text();
						    	var cardNo=$(this).parent("li").find(".cardNumberQshi").text();
						    	var cardNum=$(this).parent("li").find(".cardNumberQshiNum").text();
						    	var cstr='{"aifavabalance":"'+aifavabalance+'","cardNo":"'+cardNo+'","cardNum":"'+cardNum+'"}';
						    	var cimg=publicKey(bgImg);
						    	var cardStr=publicKey(cstr);
						    	$scope.toRecharge(publicStr,moneyStr,cardStr,cimg);
						    });
						}else{
							//console.log("失败");
						}
					}else{
						//console.log("失败");
					}
					
				},
				error:function(a,b,c){
//					alert("错误");
				}					
			});
		}else{
		}	
  };
	//列表方法调用
  $scope.cardList();
   
  //删除全时通卡
  $(".QshiCard .deleteQshiCard").off("click").live("click",function(){
	  $("#mark_one").css("display","block").find(".text").text("您确定要删除该全时通卡");
      $(".change").text("确定");
      $(".loss").text("取消");
      var cardNumberQshi = $(this).siblings(".cardNumberQshiNum").text();//全时通卡卡号
      $scope.read_name=function(){
		  if(true){
			  var parms = {};
				parms.customerNo = $scope.customerNo;//客户号
				parms.sessionId = $scope.sessionId;//令牌号
				parms.cardNo = cardNumberQshi;//卡号
				parms.symbol = 0 ;//密码类型
				parms.passWord = 1 ;//移动支付密码
				$.ajax({
					url :getRootPath()+"/PrepaidCardAction.prepaidCardDelete.do?FAPView=JSON",
					type: 'post',
					data : parms,
					success : function(data) {
						var data=$.parseJSON(data);
						//console.log("--------全时通卡删除-------");
						//console.log(data);
						$("#mark_one").css("display","none");
						if(data.FAPStatus==0){
							if(data.success==true){
								$("#mark_two").css("display","block").find(".text").text("您的全时通卡已成功删除");
						    	$(".change").off("click").live("click",function(){
						    		$("#mark_two").css("display","none");
						    		$scope.cardList();
						    	});
							}else{
								$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
						    	$(".change").off("click").live("click",function(){
						    		$("#mark_two").css("display","none");
						    	});
							}
						}else if(data.FAPStatus==2){
							$("#mark_two").css("display","block").find(".text").text("请重新登录");
					    	$(".change").off("click").live("click",function(){
					    		$("#mark_two").css("display","none");
					    		window.location.href="./index.html";
					    	});
						}else{
							$("#mark_two").css("display","block").find(".text").text(data.FAPErrorMessage);
					    	$(".change").off("click").live("click",function(){
					    		$("#mark_two").css("display","none");
					    	});
						}
				    	
					},
					error:function(a,b,c){
					//	alert("错误");
					}					
				});
			}
      }; 
  });
 	//添加银行卡返回
 	$(".toBank").off("click").on("click",function(){
 		$(".cardNumber_form").show().siblings("form").hide();
		$(".cardtype0").show();
		$("#CreditCard_next").hide();
		$(".toMain").show().siblings().hide();
 	});
  	//查询银行卡类型 
  	$scope.cardNumber_next = function(){
	  	var addCardNumber = $(".addCardNumber").val();//银行卡卡号	
	  	var reg = /^(\d{16}|\d{17}|\d{18}|\d{19})$/;
	  	var result=reg.test(addCardNumber);
	  	if(result==true){
			var parms = {};
			parms.cardNo = encryptByDES(addCardNumber);//卡号
			//console.log(addCardNumber);
			$.ajax({
				url :getRootPath()+"/AccountAction.getCardInf.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log("查询卡类型");
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							var cardtype = data.data.cardtype;
							$(".error_message").css("opacity","0");
							$(".toBank").show().siblings().hide();
							if(cardtype == "0"){
								$(".addCardCard_form").show().siblings("form").hide();
								$(".cardtype0").css("display","block");
							}else if(cardtype == "1"){
								$(".addCardCard_form").show().siblings("form").hide();
								$(".cardtype0").css("display","none");
								$("#CreditCard_next").css('display', 'block');
								//添加银行卡 - 信用卡
								  $scope.creditCard_next = function(){
									  $(".addCreditCard_form").show().siblings("form").hide();
								  };
							}
						}else{
							if(data.errors.msg=="卡号没有对应carben"){
								$(".error_message").css("opacity","1");
								$(".error_message").find("b").text("不支持此银行卡的绑定");
							}else{
								$(".error_message").css("opacity","1");
								$(".error_message").find("b").text(data.errors.msg);
							}	
						}
					}else if(data.FAPStatus==2){
						$("#mark_one").css("display","block").find(".text").text("请重新登录");
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    		window.location.href="./index.html";
				    	});
					}else{
						$(".error_message").css("opacity","1");
						$(".error_message").find("b").text(data.FAPErrorMessage);
					}					
				},
				error:function(a,b,c){
				//	alert("错误");
				}					
			});
		}else{
			$(".error_message").css("opacity","1");
			$(".error_message").find("b").text("银行卡号格式错误");
		}  
  };
  //添加银行卡号 - 储蓄卡
  $scope.addCardCard = function(){
//	  alert("添加银行卡号 - 储蓄卡");
	  var theName = $(".theName").val();//姓名	
	  var idNumber = $(".idNumber").val();//身份证号
	  var banksPhoneNumber = $(".banksPhoneNumber").val();//银行预留手机号
	  var addCardNumber = $(".addCardNumber").val();//银行卡卡号
	  var addBand_date = $(".addBand_date").val();//贷记卡有效期
	  var currentPayPswd = $(".currentPayPswd").val();//CVV2码
	  var random = Math.floor(Math.random()*10+1);//随机数
	  if(true){
			var parms = {};
			parms.channelType = "004";//渠道来源
			parms.payType = "26";//支付类型
			parms.customerNo = $scope.customerNo ;//客户号
			parms.accountNo = encryptByDES(addCardNumber) ;//银行卡号
			parms.custNm = theName ;//银行卡号姓名
			parms.mobile = encryptByDES(banksPhoneNumber) ;//银行卡预留手机号
			parms.isFlag = "0"  ;//开通快捷支付
			parms.settFlg = "0"  ;//是否是提现账户
			parms.sessionId = $scope.sessionId ;//sessionId
			parms.certno = encryptByDES(idNumber) ;//身份证号
			parms.ctftype = "1" ;//身份证类型
			parms.trcNo = random ;//协议号 随机数
			$.ajax({
				url :getRootPath()+"/ThridPayAccountAction.bankCardBindByQuick.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log("储蓄卡添加")
					console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							$(".error_message").css("opacity","0");
							$("#mark_one").css("display","block").find(".text").text("您的银行卡已添加成功");
					    	$(".change").off("click").live("click",function(){
					    		$("#mark_one").css("display","none");
					    		$scope.toMain(publicStr);
					    	});
						}else{
							$(".error_message").css("opacity","1");
							$(".error_message").find("b").text(data.errors.msg);
						}
					}else if(data.FAPStatus==2){
						$("#mark_one").css("display","block").find(".text").text("请重新登录");
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    		window.location.href="./index.html";
				    	});
					}else{
						$(".error_message").css("opacity","1");
						$(".error_message").find("b").text(data.FAPErrorMessage);
					}
				},
				error:function(a,b,c){
				//	alert("错误");
				}					
			});
		}else{
		}  
  };
  $(".theName").val($scope.customerNameCN);
  $scope.addCreditCardSub = function(){
	  var theName = $(".theName").val();//姓名	
	  var idNumber = $(".idNumber").val();//身份证号
	  var banksPhoneNumber = $(".banksPhoneNumber").val();//银行预留手机号
	  var addCardNumber = $(".addCardNumber").val();//银行卡卡号
	  var addBand_date = $(".addBand_date").val();//贷记卡有效期
	  var cvvNumber = $(".cvvNumber").val();//CVV2码
	  var random = Math.floor(Math.random()*10+1);//随机数
	  //console.log(addBand_date)
	  if(true){
			var parms = {};
			parms.channelType = "004";//渠道来源
			parms.payType = "26";//支付类型
			parms.customerNo = $scope.customerNo ;//客户号
			parms.accountNo = encryptByDES(addCardNumber) ;//银行卡号
			parms.custNm = theName ;//银行卡号姓名
			parms.mobile = encryptByDES(banksPhoneNumber) ;//银行卡预留手机号
			parms.trcNo = random ;//协议号 随机数
			parms.isFlag = "0"  ;//开通快捷支付
			parms.settFlg = "0"  ;//是否是提现账户
			parms.sessionId = $scope.sessionId ;//sessionId
			parms.certno = encryptByDES(idNumber) ;//身份证号
			parms.ctftype = "1" ;//身份证类型 
			parms.expiryDate = addBand_date;//贷记卡有效期
			parms.cvv = encryptByDES(cvvNumber);//CVV2码
			//console.log("*******信用卡*******");
			//console.log(parms);
			$.ajax({
				url :getRootPath()+"/ThridPayAccountAction.bankCardBindByQuick.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log("信用卡添加")
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							$(".error_message").css("opacity","0");
							$scope.toMain(publicStr);
						}else{
							$(".error_message").css("opacity","1");
							$(".error_message").find("b").text(data.errors.msg);
						}
					}else if(data.FAPStatus==2){
						$("#mark_one").css("display","block").find(".text").text("请重新登录");
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    		window.location.href="./index.html";
				    	});
					}else{
						$(".error_message").css("opacity","1");
						$(".error_message").find("b").text(data.FAPErrorMessage);
					}
				},
				error:function(a,b,c){
				//	alert("错误");
				}					
			});
		}else{
		}  
  };
//点击查询银行卡消费限额
 $(".descript").off("click").live("click",function(){
	  var cardName=$(this).siblings("dl").find(".bafBankName").text();
	  getPay(cardName);
  });
  //检测银行卡消费限额封装
  function getPay(cardName){
	  var parms = {};
	  $.ajax({
			url :getRootPath()+"/ThridPayAccountAction.cjtGetPaychannelFromLocal.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log("支持银行卡列表")
				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						var list=data.data.payList;
						for(var i=0;i<list.length;i++){
							if(list[i].instName==cardName){
								$scope.cardAttribute=list[i].cardAttribute+".00";
								$scope.ext=list[i].ext+".00";
								$scope.$apply();
							}
						}
						$("#description").css("display","block");
					    $(".change").off("click").live("click",function(){
						    $("#mark_one").css("display","none");
						    $("#mark_two").css("display","none");
					 	    $("#description").css("display","none");
					   });
					}else{
						$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_two").css("display","none");
				    	});
					}
				}else if(data.FAPStatus==2){
					$("#mark_two").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$("#mark_two").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$("#mark_two").css("display","block").find(".text").text(data.FAPErrorMessage);
			    	$(".change").off("click").live("click",function(){
			    		$("#mark_two").css("display","none");
			    	});
				}
				
			},
			error:function(a,b,c){
//				alert("错误");
			}					
		});
  };
  //添加银行卡 列表 初始化数据
  $scope.initListBank = function(){
		var parms = {};
		parms.customerNo = $scope.customerNo;//客户号
		parms.sessionId = $scope.sessionId;//令牌号
		parms.beginPos = 1;//起始位置
		parms.pageSize = 10;//页面记录数
		$.ajax({
			url :getRootPath()+"/AccountAction.bankAccListQuery.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log("银行卡列表")
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						$scope.result = data.data.perBankAccInfList.result;
						$scope.$apply();
						for(var j=0;j<$scope.result.length;j++){
							//卡号用*号代替 前6后4
							var cardNo=$scope.result[j].Accountno;
							var BANKNAME = $scope.result[j].bankName;
							var bafAcctype = $scope.result[j].bafAcctype;
							if(bafAcctype=="0"){
								$(".listBank_main ul li").eq(j).find('.bafAcctype').text("储蓄卡");
							}else{
								$(".listBank_main ul li").eq(j).find('.bafAcctype').text("信用卡");
							}
							var img="";
							var url="";
							img=bankCard(BANKNAME,img);
							url=bankCard(BANKNAME,url);
							var intercept=cardNo.substring(6,cardNo.length-4);//截取卡号中间9位
							var interceptCardno=cardNo.substr(0,6)+intercept.replace(intercept,"*********")+cardNo.substr(cardNo.length-4,4);
							//显示银行卡号
							$(".listBank_main ul li").eq(j).find(".cardNumber_bank").text(interceptCardno);
							$(".listBank_main ul li").eq(j).find(".bankImg").attr("src",img);
							$(".listBank_main ul li").eq(j).find(".bankBg").attr("src",url);
						}
					}else{
						$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_two").css("display","none");
				    	});
					}
				}else if(data.FAPStatus==2){
					$("#mark_two").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$("#mark_two").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$("#mark_two").css("display","block").find(".text").text(data.FAPErrorMessage);
			    	$(".change").off("click").live("click",function(){
			    		$("#mark_two").css("display","none");
			    	});
				}
				
			},
			error:function(a,b,c){
//					alert("错误");
			}					
		});
  };
  //添加银行卡 列表 初始化数据 函数调用
  $scope.initListBank();
  //删除银行卡
  $(".deleteBankCard").off("click").live("click",function(){
	  $("#mark_one").css("display","block").find(".text").text("您确定要删除该银行卡");
      $(".change").text("确定");
      $(".loss").text("取消");
      var that=$(this);
      $scope.read_name=function(){
    	  var bafBankid = that.siblings("dl").find(".bafBankid").text();//开户银行号
		  var cardNumber_bank = that.siblings("i").text();//银行账户
		  if(true){
				var parms = {};
				parms.customerNo = $scope.customerNo;//客户号
				parms.sessionId = $scope.sessionId;//令牌号
				parms.bankId = bafBankid;//开户银行号
				parms.accountNo = cardNumber_bank;//银行账户
				parms.passWord  = 10;//支付密码
				parms.symbol = 1;//密码类型
				$.ajax({
					url :getRootPath()+"/AccountAction.bankCardUnBind.do?FAPView=JSON",
					type: 'post',
					data : parms,
					success : function(data) {
						var data=$.parseJSON(data);
						//console.log("--------银行卡删除 解绑卡-------");
						//console.log(data);
						$("#mark_one").css("display","none");
						if(data.FAPStatus==0){
							if(data.success==true){
								$("#mark_two").css("display","block").find(".text").text("您的银行卡已成功删除");
						    	$(".change").off("click").live("click",function(){
						    		$("#mark_two").css("display","none");
						    		$scope.initListBank();
						    	});
							}else{
								$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
						    	$(".change").off("click").live("click",function(){
						    		$("#mark_two").css("display","none");
						    	});
							}
						}else if(data.FAPStatus==2){
							$("#mark_two").css("display","block").find(".text").text("请重新登录");
					    	$(".change").off("click").live("click",function(){
					    		$("#mark_two").css("display","none");
					    		window.location.href="./index.html";
					    	});
						}else{
							$("#mark_two").css("display","block").find(".text").text(data.FAPErrorMessage);
					    	$(".change").off("click").live("click",function(){
					    		$("#mark_two").css("display","none");
					    	});
						}
				    	
					},
					error:function(a,b,c){
					//	alert("错误");
					}					
				});
			}
      };
  });  
  //支行框架调用
  $(".addBand_date").sjSelect();
};
angular.module("myapp")
       .controller("addBank",["$scope","$rootScope","$location","$state","$stateParams",addBank]);