/*--------------------------------------申请电子卡-------------------------------------------------*/
function apply($scope,$rootScope,$location,$state,$stateParams,$http){
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
   
   //定义全局变量
   var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
   var publicStr=publicKey(str);
   var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}'
   var moneyStr=publicKey(mstr);
   //关闭按钮
   $scope.close=function(){
	   $(".mark").css("display","none");
   }
   //点击返回按钮
   $(".toApply").off("click").live("click",function(){
	   $("#applicationRecord").css("display","block");
	   $(".electronicCard").css("display","block");
	   $(".electronicMessage").css("display","none");
	   $(".electronicPay").css("display","none");
	   $(".toApply").hide().siblings().show();
	   $(".payLifeList").html("");
	   $(".applySend").removeAttr("disabled");//删除点击禁止事件
		curCount=0;//当前剩余秒数
		numBer=0;//判断是否显示重新获取
   });
   //点击下一步 申请电子卡 申请
   var amount="";
   $scope.show_card_money=function(){
	   if($("#electronicCardSelect option:selected").val()=="请选择"){
		   $("#mark_two").css("display","block").find(".text").text("请选择电子卡种类");
	   }else{
		   if(amount==""){
			   $("#mark_two").css("display","block").find(".text").text("请选择卡面值");
		   }else{
			   if($(".agree").attr("checked")){
				   $(".toApply").show().siblings().hide();
				   $(".electronicCard").css("display","none");
				   $(".electronicMessage").css("display","block");
				   $(".electronicPay").css("display","none");
				   $("#applicationRecord").css("display","none");
				   cardNum();
				   //点击显示支付方式 
				   $(".show_card_pay").off("click").on("click",function(){
					   $(this).attr('disabled',"true");
					   showPay(amount);
				   });
			   }else{
				   $("#mark_two").css("display","block").find(".text").text("请先阅读全时通卡用卡说明");
			   }
		   }
		   
	   }
   };
   $(".moneyList a").off("click").on("click",function(){
	   if($("#electronicCardSelect option:selected").val()=="请选择"){
		   $("#mark_two").css("display","block").find(".text").text("请选择电子卡种类");
	   }else{
		   $(this).css({"border":"none","background":"#EA5532"}).find("h4").css("color","#fff");
		   $(this).siblings("a").css({"border":"1px solid #EA5532","background":"#fff"}).find("h4").css("color","#333");
		   amount=$(this).find("b").text();//卡面值
		   /*amount="0.01";*///卡面值
		   
	   };
   });
   //点击确认是否需要发票
   $(".invoice li input").off("click").on("click",function(){
	   if($(this).next("b").text()=="是"){
		   $(".invoiceHeader").css("display","block");
	   }else if($(this).next("b").text()=="否"){
		   $(".invoiceHeader").css("display","none");
	   };
	});
   //申请电子卡张数设置 卡产品数量查询
   function cardNum(){
	   var parms = {};
		$http({
		   method:"POST",
		   url:getRootPath()+"/EcardAction.getCardProductCount.do?FAPView=JSON",
		   data:parms
		}).success(function(data) {
//				console.log("卡产品数量查询");
//				console.log(data);
			if(data.FAPStatus==0){
				if(data.success==false){
					$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
				}else{
					var numberr;
					if(data.data.list.length==0){
						numberr=5;
					}else{
						if(data.data.list[0].numberr<=5){
							numberr=data.data.list[0].numberr;
						}else{
							numberr=5;
						}	
					};
					$(".reduce").off("click").on("click",function(){
						if($(".buyCardsNum").val()<=1){
							$(".buyCardsNum").val(1);
						}else{
							$(".buyCardsNum").val(parseInt($(".buyCardsNum").val())-1);
						}
					});
					$(".plus").off("click").on("click",function(){
						if($(".buyCardsNum").val()>=numberr){
							$(".buyCardsNum").val(5);
						}else{
							$(".buyCardsNum").val(parseInt($(".buyCardsNum").val())+1);
						}
					});
					$(".buyCardsNum").blur(function(){ 
						if($(".buyCardsNum").val()<=1){
							$(".buyCardsNum").val(1);
						}else if($(".buyCardsNum").val()>=numberr){
							$(".buyCardsNum").val(5);
						}
					});
				};
			}else if(data.FAPStatus==2){
				$("#mark_two").css("display","block").find(".text").text("请重新登录");
				$(".change").off("click").live("click",function(){
		    		$("#mark_two").css("display","none");
		    		window.location.href="./index.html";
		    	});
			}else{
				$("#mark_two").css("display","block").find(".text").text(data.FAPErrorMessage);
			};
		}).error(function(a,b,c){
//					alert("错误");
		});					
		
	}

	/*全时通卡用卡说明*/
	$(".description b").off("click").on("click",function(){
		$("#markApply").css("display","block");
	})
	$scope.closeadd=function(){
		$("#markApply").css("display","none");
		$("#markApplyList").css("display","none");
	}
	//卡产品查询
	function cardList(){
		var parms = {};
		 $http({
			 method:"POST",
			 url:getRootPath()+"/EcardAction.getCardProductDef.do?FAPView=JSON",
			 data:parms
		}).success(function (data) {
			//console.log("--卡产品查询--");
			//console.log(data);
			if(data.FAPStatus==0){
				if(data.success==false){
					$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
				}else{
					$scope.cardSelect=data.data.list;
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
         });
	};
	cardList();//卡产品查询调用
	
	
	//封装电子卡记录分页
	function page(pages){
		$(function(){
			$("#page").Page({
	          totalPages: pages,//分页总数
	          liNums: 7,//分页的数字按钮数(建议取奇数)
	          activeClass: 'activP', //active 类样式定义
	          callBack : function(page){
	        	 // console.log(page);
	        	  //application(page);
	          }
	      });
		});
	};
	/*申请记录*/
	$("#applicationRecord").off("click").on("click",function(){
		application(1)
	});
	function application(begin){
		var parms = {};
		parms.customerNo=$scope.customerNo;
		$.ajax({
			url :getRootPath()+"/EcardAction.queryCardList.do?FAPView=JSON",
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==false){
						$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
					}else{
						$("#applyRecord").css("display","block");
						if(data.list.length==0){
							$(".listTwo").css("display","none");
							$("#sorry").css("display","block");
							$(".trading_main ").css("border","none");
						}else{
							$(".listTwo").css("display","block")
							$("#sorry").css("display","none");
							$(".trading_main ").css("border","1px solid #ccc");
							$scope.applyList=data.list;
							$scope.$apply();
							for(var i=0;i<$scope.applyList.length;i++){
								var time=$scope.applyList[i].scoaudittime;
								var scoaudittime=time.substr(0,4)+"-"+time.substr(4,2)+"-"+time.substr(6,2)+" "+time.substr(8,2)+":"+time.substr(10,2)+":"+time.substr(12,2);
								$(".applyListTwo").eq(i).find(".scocreatetime").text(scoaudittime);
							}
							//page(1);
							/*点击显示卡列表*/
							$(".detail").off("click").on("click",function(){
								var scoorderno=$(this).parent().siblings(".scoorderno").text();
								var id=1;
								showCardList(scoorderno,id);
							})
						}
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
	//					alert("错误");
			}					
		});	
	};
	
	/*申请记录 适配手机端*/
	$scope.applicationFun = function(){
		var screen = document.body.clientWidth;
		//console.log(screen);
		//alert(screen);
		if(screen <="750"){
			$("#applicationRecord").off("click").on("click",function(){
				alert("999");
				$("#applyFirst h2").css("display","none");
			})
		}else{
			
		};
	}
	//$scope.applicationFun();
	
	/*点击显示卡列表*/
	function showCardList(scoorderno,id){
		$scope.scoorderno=scoorderno;
		var parms = {};
		parms.orderno=scoorderno;
		$.ajax({
			url :getRootPath()+"/EcardAction.getCardInfDetail.do?FAPView=JSON",
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==false){
						$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
					}else{
						$scope.scoorderList=data.list;
						$scope.$apply();
						$(".cardNo").text(data.list[0].cardno);
						$(".cardPass").text(data.list[0].password);
						if(id==1){
							$("#markApplyList").css("display","block");
						}else{
							$("#markApplyList").css("display","none");
						}
						
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
	//					alert("错误");
			}					
		});	
	}
	//点击显示下一步支付  //支付方式
	function showPay(amount){	
		curCount=0;//当前剩余秒数
		numBer=0;//判断是否显示重新获取
		var parms = {};
		parms.customerNo = $scope.customerNo;//客户号
		element=".payLifeList";
		pub(parms,element);
		/*申请电子卡订单确认*/
		var cardType=$("#electronicCardSelect option:selected").val();//卡种类
		var cardNum=$(".buyCardsNum").val();//申请数量
		var isDill="";//是否开发票
		var dillName="";//发票抬头名称
//		var totalPayAmount=parseInt(amount)*parseInt(cardNum);//总金额
		var totalPayAmount=amount*parseInt(cardNum);//总金额
		$(".totalAmount").text(fmoney(totalPayAmount,2));
		//是否开发票
		if($(".invoice li input:checked").next("b").text()=="是"){
			isDill=1;
			dillName=$(".invoiceText").val();
		}else{
			isDill=0;
			dillName="";
		}
		var params={};
		params.userId=$scope.customerNo;//客户号
		params.cardType=cardType;//卡种类
		params.cardNum=cardNum;//申请数量
		params.isDill=isDill;//是否开发票
		params.dillName=dillName;//发票抬头名称
		params.totalPayAmount=totalPayAmount;//总金额
		params.amount=amount;//卡面额
		$.ajax({//申请电子卡订单确认接口
			url :getRootPath()+"/EcardAction.confirmCardOrder.do?FAPView=JSON",
			data : params,
			success : function(data) {
				var data=$.parseJSON(data);
//				console.log("--申请电子卡订单确认--");
//				console.log(data);
//				console.log(data.data.orderno);
				var orderno = data.data.orderno;
				if(data.FAPStatus==0){
					if(data.success==false){
						$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
					}else{
						$(".show_card_pay").removeAttr("disabled");//删除点击禁止事件
						$(".orderno").text(orderno);//订单号 获取
						$(".backToMain").css("display","block");
						$(".electronicCard").css("display","none");
						$(".electronicMessage").css("display","none");
						$(".electronicPay").css("display","block");
						$("#applicationRecord").css("display","none");
						//发送短信接口调用
						$(".applySend").off("click").on("click",function(){
							$(this).attr('disabled',"true");
							//console.log(1)
							SendPhoneMessage(totalPayAmount,amount);
						});
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
	//					alert("错误");
			}					
		});	
	}
	//发送短信 支付接口
	function SendPhoneMessage(totalPayAmount,amount){
		//alert("发送短信 支付接口");
		var orderNo = $(".orderno").text();
		var initAmt = totalPayAmount;//充值金额，总金额
		var accountNo = $('input[name="payCard"]:checked').val();//银行卡号		
		
		var encryption;
			encryption ="accountNo="+encryptByDES(accountNo)+"&channelType=005&customNo="+$scope.customerNo+"&initAmt="+initAmt+"&orderNo="+orderNo+"&payType=3";
			//console.log(encryption);
			//console.log(md5(encryption));
			
		if(true){
			var parms = {};
			parms.orderNo = orderNo;//订单号
			parms.initAmt = initAmt;//充值金额，总金额
			parms.channelType = "005";//渠道类型
			parms.accountNo = encryptByDES(accountNo);//银行卡号
			parms.customNo = $scope.customerNo;//客户号;//用户编号，跟userid一个值
			parms.payType = "3";
			
			parms.signKey=publicKeyRSA(md5(encryption));
			//console.log(parms.signKey);
			$.ajax({
				url :getRootPath()+"/EcardAction.cardRecharge.do?FAPView=JSON",
				data : parms,
				success : function(data) {
					$(".SendPhoneMessage").removeAttr("disabled");//删除点击按钮禁止状态
					var data=$.parseJSON(data);
//					console.log("----发送短信数据----")
//					console.log(data);
//					console.log(data.data.scoorderno);
					if(data.FAPStatus==0){
						if(data.success==true){
							if(data.data.authenticate_status==1){
								$("#mark_two").css("display","block").find(".text").text(data.data.errMsg);
							}else{
								sign();
								var order_no = data.data.orderno;
								var flowno = data.data.flowno;
								var scoorderno = data.data.scoorderno;
								//点击提交
								$(".paySubmit").off("click").on("click",function(){
									curCount=0;//当前剩余秒数
									//alert("tijiao")
									paySubmit(order_no,flowno,scoorderno,amount,totalPayAmount);
								});
							}
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
					};
				},
				error:function(a,b,c){
					//alert("错误");
				}					
			});
		};

		////
	};
	
	//申请电子卡 提交 申请结果接口
	function paySubmit(order_no,flowno,scoorderno,amount,totalPayAmount){
		//alert("申请电子卡 提交");
		var payValidateCode = $("#shortMessageLife").val();//短信验证码
		var enterbank = $('input[name="payCard"]:checked').val();//银行卡号
		
		var encryption;
		encryption ="amount="+amount+"&author="+$scope.customerNo+"&enterbank="+encryptByDES(enterbank)+"&orderno="+order_no+"&payType=3&payValidateCode="+encryptByDES(payValidateCode)+"&scoorderno="+scoorderno;
		//console.log(encryption);
		//console.log(md5(encryption));
		
		var parms = {};
		parms.author = $scope.customerNo;;//同userId
		parms.payValidateCode = encryptByDES(payValidateCode);//验证码
		parms.scoorderno= scoorderno;//流水号
		parms.enterbank = encryptByDES(enterbank);//银行卡号
		parms.amount= amount;//面额
		parms.payType="3";//付款方式 请传3
		parms.orderno = order_no;//订单号
		
		parms.signKey=publicKeyRSA(md5(encryption));
		//console.log(parms.signKey);
		
		$.ajax({
			url :getRootPath()+"/EcardAction.cardOrderAudit.do?FAPView=JSON",
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
//				console.log("--申请结果接口--");
//				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.authenticate_status==1){
							$("#mark_two").css("display","block").find(".text").text(data.data.errMsg);
						}else{
							//console.log($(".buyCardsNum").val());
							if($(".buyCardsNum").val()==1){
								var id=2;
								showCardList(order_no,id);
								$("#aSheet").css("display","block");
							}else{
								$(".sheetNum").text($(".buyCardsNum").val());
								$("#sheets").css("display","block");
								$("#sheets label").off("click").on("click",function(){
									var id=1;
									showCardList(order_no,id);
								});
							}
							$scope.change=function(){
								$(this).css("display","none");
								$scope.toMain(publicStr);
							}
						}					
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
				};
			},
			error:function(a,b,c){
				//alert("错误");
			}					
		});
	};
	/*申请记录返回至首页*/
	$("#applyRecord .backToApply").off("click").on("click",function(){
		$("#applyRecord").css("display","none");
		$("#applicationRecord").css("display","block");
	})
};
angular.module("myapp")
		.controller("apply",["$scope","$rootScope","$location","$state","$stateParams","$http",apply]);