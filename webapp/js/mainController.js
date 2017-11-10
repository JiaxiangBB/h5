function main($scope,$rootScope,$location,$state,$stateParams){
	//设置金额
	function fmoney(s, n) { 
		n = n > 0 && n <= 20 ? n : 2; 
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
		var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1],t = "";  
		for (i = 0; i < l.length; i++) { 
		    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
		} 
		return t.split("").reverse().join("") + "." + r; 
	} 
  //获取wrap页面的参数         
	 //解析url参数 
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
    console.log($scope.customerNo);
    console.log($scope.sessionId);
    console.log($scope.customerNameCN);
    //定义全局变量
    var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
	var publicStr=publicKey(str);
	var moneyStr="";
	//退出
	$scope.out=function(){
		window.location.href="./index.html";
	};
  //全时通卡列表调用
    $scope.cards_list=function(){
    	$scope.toList(publicStr,moneyStr);
    };
  //银行卡列表调用
    $scope.bank_list=function(){
    	$scope.tolistBank(publicStr,moneyStr);
    }; 
  //安全管理调用
    $scope.safety=function(){
    	//alert("kjkhj")
    	$scope.tosafety(publicStr,moneyStr);
    };
//    //优惠券调用
//    $scope.coupons = function(){
//    	$scope.toCoupons(publicStr,moneyStr);
//    };
  //交易明细调用
    $scope.toTrading=function(){
    	$scope.totrading(publicStr,moneyStr);
    };
    //优惠券数量初始化
   /* Coupon();
    function Coupon(){
    	var parms = {};
		parms.customerNo = $scope.customerNo;//客户号
		parms.sessionId = $scope.sessionId;//令牌号	
		parms.status="";	
		$.ajax({
			url :getRootPath()+"/PublicPayAction.findCouponList.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				console.log(data);
				$("#mark_one").css("display","none");
				if(data.FAPStatus==0){
					if(data.success==true){
						$scope.CouponNum=data.data.couponList.length;
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
    };*/
	//银行卡删除 解绑卡
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
							    		$scope.informationAssets();
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
						    	})
							}
						},
						error:function(a,b,c){
						//	alert("错误");
						}					
					});
				}
	      }	  
	  }) 
	//点击弹框关闭按钮
    $scope.close=function(){
	   $("#mark_one").css("display","none");
	   $("#mark_two").css("display","none");
    }
    if($scope.customerNameCN=="未实名"){
		 $scope.real_name="立即认证";
		 $scope.name_img1=true;
		 $scope.name_img2=false;
		 $scope.prompt1=true;
		 $scope.prompt2=false;
		//实名认证调用
		 $scope.read_name=function(){
		    $scope.toapprove(publicStr,moneyStr);
		 } 
	    //实名前的弹框
	    $(".apply").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("实名认证、设置支付 密码并未账户充值或添加储蓄卡后才可以申请");
	    	$(".change").text("立即认证");
	    });
	    //实名前 点击优惠券弹框
	    $(".coupon").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以查看优惠券");
	    	$(".change").text("立即认证");
	    });
	    $(".pay_transfer").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("实名认证、设置支付 密码并添加全时通卡或储蓄卡后才可以充值");
	    	$(".change").text("立即认证");
	    });
	    $(".zhuanzhang").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以转账");
	    	$(".change").text("立即认证");
	    });
	    $(".add_card").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以添加全时通卡");
	    	$(".change").text("立即认证");
	    });
	    $(".add_bank").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以添加银行卡");
	    	$(".change").text("立即认证");
	    });
	    $(".money").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以进行提现操作");
	    	$(".change").text("立即认证");
	    });
	    //点击弹框关闭按钮
	    $scope.close=function(){
		   $("#mark_one").css("display","none");
	       $("#mark_two").css("display","none");
	       $("#mark_search").css("display","none");
	    }
	  }else{
		  $scope.real_name="已认证";
		  $scope.name_img1=false;
		  $scope.name_img2=true;
		  $scope.prompt1=false;
		  $scope.prompt2=true;
		  if($scope.payPwdFlag=="1"){
			  $("#mark_one").css("display","none");
		       $("#mark_two").css("display","none");
		       $("#mark_search").css("display","none");
		       //添加全时通卡调用
		       $(".add_card").off("click").live("click",function(){
			    	$scope.toAdd(publicStr,moneyStr);
			    }) 
			    //账户充值 方便 充值页面 传参数
			    $(".pay_transfer").off("click").live("click",function(){
			    	$scope.toPrepaid(publicStr,moneyStr);
			    })
			    //申请电子卡调用
			   $(".apply").off("click").live("click",function(){
			    	$scope.toApply(publicStr,moneyStr);
			    })
			    //全时通卡充值调用
			    $(".card_recharge_first").off("click").live("click",function(){
			    	var bgImg=$(this).parent("li").css('backgroundImage');
			    	var aifavabalance=$(this).parent("li").find("h2").text();
			    	var cardNo=$(this).parent("li").find(".cardNumberQshi").text();
			    	var cardNum=$(this).parent("li").find(".cardNumberQshiNum").text();
			    	var cstr='{"aifavabalance":"'+aifavabalance+'","cardNo":"'+cardNo+'","cardNum":"'+cardNum+'"}';
			    	var cimg=publicKey(bgImg);
			    	var cardStr=publicKey(cstr);
			    	$scope.toRecharge(publicStr,moneyStr,cardStr,cimg);
			    })
			    //获取账户余额 方便 转账页面 传参数
			    $(".zhuanzhang").off("click").live("click",function(){
			    	$scope.toTransfer(publicStr,moneyStr);
			    });
		       	//查询优惠券 传参数
		       	$(".coupon").off("click").live("click",function(){
		       	    $scope.toCoupons(publicStr,moneyStr);
//		       		alert("优惠券")
			    });			    
			  //添加银行卡调用
			    $(".add_bank").off("click").live("click",function(){
			    	$scope.toaddBank(publicStr,moneyStr);
			    })
			    //判断账户余额进行提现
			  	$(".money").off("click").live("click",function(){
			    	if($scope.balance==0){
			    		$("#mark_one").css("display","block").find(".text").text("抱歉，您的账户余额为0，不能进行提现");
				    	$(".change").text("确定");
				    	$(".loss").css("display","none");
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    	})
				    }else{
				    	//账户余额提现
				  		 $scope.toDeposit(publicStr,moneyStr);
				    }
			    })
		  }else{
			  //设置支付密码调用
				 $scope.read_name=function(){
				    $scope.topayPassword(publicStr,moneyStr);
				 } 
			    //设置支付密码前的弹框
			    $(".apply").off("click").live("click",function(){
			    	$("#mark_one").css("display","block").find(".text").text("实名认证、设置支付 密码并未账户充值或添加储蓄卡后才可以申请");
			    	$(".change").text("立即设置");
			    });
			  //实名前 点击优惠券弹框
			    $(".coupon").off("click").live("click",function(){
			    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以查看优惠券");
			    	$(".change").text("立即设置");
			    });
			    $(".pay_transfer").off("click").live("click",function(){
			    	$("#mark_one").css("display","block").find(".text").text("实名认证、设置支付 密码并添加全时通卡或储蓄卡后才可以充值");
			    	$(".change").text("立即设置");
			    });
			    $(".zhuanzhang").off("click").live("click",function(){
			    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以转账");
			    	$(".change").text("立即设置");
			    });
			    $(".add_card").off("click").live("click",function(){
			    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以添加全时通卡");
			    	$(".change").text("立即设置");
			    });
			    $(".add_bank").off("click").live("click",function(){
			    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以添加银行卡");
			    	$(".change").text("立即设置");
			    });
			    $(".money").off("click").live("click",function(){
			    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以进行提现操作");
			    	$(".change").text("立即设置");
			    });
			    //点击弹框关闭按钮
			    $scope.close=function(){
				   $("#mark_one").css("display","none");
			       $("#mark_two").css("display","none");
			       $("#mark_search").css("display","none");
			   }
		  }		
	  } 
	  //初始化首页信息
	  $scope.informationAssets=function(){
		  //初始化信息资产,账户余额
		  if(true){
				var parms = {};
				parms.customerNo= $scope.customerNo;//客户号
				$.ajax({
					url :getRootPath()+"/PrepaidCardAction.cardBalQuery.do?FAPView=JSON",
					type: 'post',
					data : parms,
					success : function(data) {
						var data=$.parseJSON(data);
						//console.log(data);
						if(data.FAPStatus==0){
							if(data.success==true){
								$scope.accountBalance = fmoney(data.data.bankLists.avaAccountBalance,2);//总资产
								$scope.balance_wrap = fmoney(data.data.bankLists.avaBalance,2);//账户余额
								$scope.$digest();
								var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}'
								moneyStr=publicKey(mstr);
							}else{
								$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
							}
						}else if(data.FAPStatus==2){
							$("#mark_two").css("display","block").find(".text").text("请重新登录");
					    	$(".change").off("click").live("click",function(){
					    		$("#mark_two").css("display","none");
					    		window.location.href="./index.html";
					    	})
						}else{
							$("#mark_two").css("display","block").find(".text").text(data.FAPErrorMessage);
						}
						
					},
					error:function(a,b,c){
//						alert("错误");
					}
					
				});
			}else{
				
			}
		  //初始化全时通卡信息
		  var parm = {};
			parm.customerNo = $scope.customerNo;//客户号
			$.ajax({
				url :getRootPath()+"/PrepaidCardAction.cardQuery.do?FAPView=JSON",
				type: 'post',
				data : parm,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log("------查询卡-------");
					//console.log(data);
					$scope.cdcard_list = data.data.cdcard;
					$scope.card_num = data.data.cdcard.length;
					$scope.$digest();
					if($scope.cdcard_list.length>0){
						$(".wrap_main_r_one .main").css("display","none").next().css("display","block");
						//循环显示全时通卡背景
						var i=0;
						var totalMoney=0;
						for(var j=0;j<$scope.cdcard_list.length;j++){
							//卡号用*号代替 前6后4
							var cardNo=$scope.cdcard_list[j].CARDNO;
							var intercept=cardNo.substr(6,9);
							var interceptCardno=cardNo.substr(0,6)+intercept.replace(intercept,"*********")+cardNo.substr(15,4);
							//显示金额样式
							$(".wrap_main_r_one .main_two ul li").eq(j).find("h2").text(fmoney($scope.cdcard_list[j].BALANCE,2));
							$(".wrap_main_r_one .main_two ul li").eq(j).find(".cardNumberQshi").text(interceptCardno);
							$(".wrap_main_r_one .main_two ul li").eq(j).find(".cardNumberQshiNum").text(cardNo);
							totalMoney+=$scope.cdcard_list[j].BALANCE;
							if(j>=5){
								i=0;
							}else{
								i++;
							}
							$(".wrap_main_r_one .main_two ul .quanShiCardBg").eq(j).css({"background-image":"url("+$rootScope.imagesSRC+"card/ka"+(i)+".png)","background-repeat":"no-repeat","background-size":"cover"});
							//划过全时通卡显示充值
							$(".wrap_main_r_one .main_two ul li").eq(j).on("mouseover",function(){
								$(this).find(".card_recharge").show();
							 });
							$(".wrap_main_r_one .main_two ul li").eq(j).on("mouseout",function(){
								$(this).find(".card_recharge").hide();
							 });
						}
						$scope.quanShiCard=fmoney(totalMoney,2);
						$(".quanShiCard_wrap").text(fmoney(totalMoney,2));
					}else{
						$scope.quanShiCard=fmoney(0,2);
						$(".wrap_main_r_one .main").css("display","block").next().css("display","none");
					}
					$scope.$apply();
				},error:function(){
					//alert("错误")
				}
			})
		   //初始化银行卡信息
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
					console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							$scope.bankcard_list = data.data.perBankAccInfList.result;
							$scope.bank_num = $scope.bankcard_list.length;
							$scope.$apply();
							if($scope.bankcard_list.length>0){
								$(".wrap_main_r_two .main").css("display","none").next().css("display","block");
								for(var n=0;n<$scope.bankcard_list.length;n++){
									var bankcardNo = $scope.bankcard_list[n].bafAccountno;//银行卡号
									var BANKNAME = $scope.bankcard_list[n].bankName;
									var bafAcctype = $scope.bankcard_list[n].bafAcctype;
									if(bafAcctype=="0"){
										$(".wrap_main_r_two .main_two ul li").eq(n).find('.bafAcctype').text("储蓄卡");
									}else{
										$(".wrap_main_r_two .main_two ul li").eq(n).find('.bafAcctype').text("信用卡");
									}
									var img="";
									var url="";
									img=bankCard(BANKNAME,img);
									url=bankCardBg(BANKNAME,url);
									var interceptBank = bankcardNo.substring(6,bankcardNo.length-4);//截取卡号中间9位
									var interceptBankCardno = bankcardNo.substr(0,6)+interceptBank.replace(interceptBank,"*********")+bankcardNo.substr(bankcardNo.length-4,4);
									$(".wrap_main_r_two .main_two ul li").eq(n).find("p").text(interceptBankCardno);
									$(".wrap_main_r_two .main_two ul li").eq(n).find(".bankSmall").attr("src",img);
									$(".wrap_main_r_two .main_two ul li").eq(n).find(".bankBig").attr("src",url);
									//划过银行卡显示删除
									$(".wrap_main_r_two .main_two ul li").eq(n).on("mouseover",function(){
										 $(this).find(".deleteBankCard").show();
									 });
									$(".wrap_main_r_two .main_two ul li").eq(n).on("mouseout",function(){
										$(this).find(".deleteBankCard").hide();
									 });
								}
							}else{
								$(".wrap_main_r_two .main").css("display","block").next().css("display","none");
							}
						}else{
							$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
					    	$(".change").off("click").live("click",function(){
					    		$("#mark_two").css("display","none");
					    	})
						}
					}else if(data.FAPStatus==2){
						$("#mark_two").css("display","block").find(".text").text("请重新登录");
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_two").css("display","none");
				    		window.location.href="./index.html";
				    	})
					}else{
						$("#mark_two").css("display","block").find(".text").text(data.FAPErrorMessage);
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_two").css("display","none");
				    	})
					}
					
				},
				error:function(a,b,c){
//					alert("错误");
				}					
			});
	  }  
}

angular.module("myapp")
		.controller("main",["$scope","$rootScope","$location","$state","$stateParams",main]);