/*--------------------------------------全时通卡充值------------------------------------------------*/
function recharge($scope,$rootScope,$location,$state,$stateParams){
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
   var mobj=angular.fromJson(mprivateStr);
   $scope.balance_wrap = mobj.balance_wrap;//转账页面显示 账户余额
   $scope.accountBalance = mobj.accountBalance;
   $scope.quanShiCard=mobj.quanShiCard;
   //解析url参数    二级页面    cardStr
   var cstr = $stateParams.cardStr;
   var cprivateStr=privateKey(cstr);
   var cobj=angular.fromJson(cprivateStr);
   $scope.aifavabalance = cobj.aifavabalance;
   $scope.cardNo=cobj.cardNo;
   $scope.cardNum=cobj.cardNum;
   //解析url参数    二级页面    cimg
   var cimg = $stateParams.cimg;
   $scope.bgImg=privateKey(cimg);
   //定义全局变量
   var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
	var publicStr=publicKey(str);
	var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}'
	var moneyStr=publicKey(mstr);
	//点击弹框关闭按钮
	 $scope.close=function(){
		$("#mark_one").css("display","none");
	 }
	//点击返回按钮
	$(".back").off("click").live("click",function(){
		$(".paySendPhoneMessage").removeAttr("disabled");//删除点击按钮禁止状态
		$scope.toMain(publicStr);
	})
	 //添加银行卡调用
    $scope.add_banks=function(){
    	$scope.toaddBank(publicStr,moneyStr);
    } 
	$(".recharge_main").find("li").css({"background-image":$scope.bgImg,"background-repeat":"no-repeat"});
	var rules_money =/^\d+(\.\d+)?$/;
	//全时通卡 充值金额   下一步
	  $scope.rechargeNext = function(){
		  if($("#pre_money").val()==""){
			  $("#mark_one").css("display","block").find(".text").text("请输入充值金额");
		  }else{
			  var isMoney = rules_money.test($("#pre_money").val());
			  if(isMoney){
				  $(".topUpAmount").text(fmoney($("#pre_money").val(),2));
				  $(".recharge_money_one").css("display","none");
				  $(".recharge_money_next").css("display","block");
				  $(".rechargeBank").css("opacity","1");
				  $(".rechargeBank").off("click").on("click",function(){
					  $(".rechargeBank").css("opacity","0");
					  $(".recharge_money_one").css("display","block");
					  $(".recharge_money_next").css("display","none");
					  $(".payCardlist_card").html("");
				  });
				//全时通卡充值列表显示
				  if(true){
						var parms = {};
						parms.customerNo = $scope.customerNo;//客户号
						element=".payCardlist_card";
						pub(parms,element);
					}
			  }else{
				  $("#mark_one").css("display","block").find(".text").text("金额格式错误");
			  }
		  }
		  
	  };
	
	  //充值 --- 发送短信验证码 PublicPayAction.cardRechargeByQuick.do
		$(".paySendPhoneMessage").off("click").on("click",function(){
			$(this).attr('disabled',"true");
			curCount=0;//当前剩余秒数
			numBer=0;//判断是否显示重新获取
			var payValidateCode=$(".message_code").val();
			var initAmt=$("#pre_money").val();
			//console.log(initAmt)
			if(true){
				var encryption="accountNo="+encryptByDES($('input[name="payCard"]:checked').val())+"&cardNo="+encryptByDES($scope.cardNum)+"&channelType=005&customNo="+$scope.customerNo+"&initAmt="+initAmt+"&payType=26";
			    var parms = {};
			    parms.customNo = $scope.customerNo;//客户号
				parms.sessionId = $scope.sessionId;//令牌号
				parms.cardNo = encryptByDES($scope.cardNum);//卡号
				parms.initAmt = initAmt;//金额
				parms.channelType = "005";
				parms.accountNo = encryptByDES($('input[name="payCard"]:checked').val());//银行卡号
				parms.payType = "26";
				parms.signKey=publicKeyRSA(md5(encryption));
				console.log(encryption);
				console.log(md5(encryption));
				/*var parms = {};
				parms.channelType= 005;//渠道来源
				parms.payType= 26;//支付类型
				parms.customerNo= $scope.customerNo;//客户号
				parms.amount= initAmt;//金额
				parms.accountNo= $('input[name="payCard"]:checked').val();//银行卡号
				parms.sessionId= $scope.sessionId;//sessionId*/
				$.ajax({//PublicPayAction.cardRechargeByQuick
					url :getRootPath()+"/PublicPayAction.cardRechargeByQuick.do?FAPView=JSON",
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
									sign();
									var order_no = data.data.orderno;
									var flowno = data.data.flowno;
									$(".orderNo").val(order_no);
									$(".flowno").val(flowno);
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
						//alert("错误");
					}
					
				});
			}
		});
		//全时通卡充值点击提交
	  $scope.recharge=function(){
		  curCount=0;
		  if($(".message_code").val()==""){
			  $("#mark_one").css("display","block").find(".text").text("验证码不可为空");
		  }else{
			  var cardNo = $scope.cardNum;
			  var accountNo=$('input[name="payCard"]:checked').val();
			  var orderNo=$(".orderNo").val();
			  var flowno=$(".flowno").val();
			  var payValidateCode=$(".message_code").val();
			  if(orderNo==""){
				  $("#mark_one").css("display","block").find(".text").text("请点击获取短信验证码");
			  }else{
				  var parms = {},encryption;
				  /*if(flowno=="" || orderNo==""){
					  encryption=encryptByDES(cardNo)+"&"+$scope.customerNo+"&"+encryptByDES(payValidateCode)+"&"+encryptByDES(accountNo);
				  }else{*/
				  encryption="cardNo="+encryptByDES(cardNo)+"&customNo="+$scope.customerNo+"&flowno="+flowno+"&orderno="+orderNo+"&payValidateCode="+encryptByDES(payValidateCode)+"&recordedBank="+encryptByDES(accountNo);
				  /*}*/
					parms.customNo = $scope.customerNo;//客户号
					parms.sessionId = $scope.sessionId;//令牌号
					parms.cardNo = encryptByDES(cardNo);//卡号
					parms.orderno = orderNo ;
					parms.flowno = flowno;
					parms.payValidateCode = encryptByDES(payValidateCode) ;//验证码
					parms.recordedBank = encryptByDES(accountNo) ;//银行卡号
					parms.signKey=publicKeyRSA(md5(encryption));
					//console.log(encryption);
					//console.log(md5(encryption));
					$.ajax({
						url :getRootPath()+"/PublicPayAction.payMentAuth.do?FAPView=JSON",
						data : parms,
						success : function(data) {
							var data=$.parseJSON(data);
							//console.log(data);
							if(data.FAPStatus==0){
								if(data.success==true){
									if(data.data.tradeStatus==0){
										$("#mark_one").css("display","block").find(".text").text("您已成功为全时通卡充值");
										$(".change").off("click").live("click",function(){
											$("#mark_one").css("display","none");
											$scope.toMain(publicStr);
										})
									}else if(data.data.tradeStatus==1){
										$("#mark_one").css("display","block").find(".text").text("交易正在处理");
										$(".change").off("click").live("click",function(){
								    		$("#mark_one").css("display","none");
								    		$scope.toMain(publicStr);
								    	})
									}else{
										$("#mark_one").css("display","block").find(".text").text(data.data.errMsg);
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
			  }
			  
		  }
		  
	  }
};

angular.module("myapp")
		.controller("recharge",["$scope","$rootScope","$location","$state","$stateParams",recharge]);