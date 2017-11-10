;(function($){
	//解析参数
	var imgSRC="../";
	var url = window.location.search;
	var str = url.substr(1);
	var privateStr="?"+privateKey(str);
	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(privateStr)||[,""])[1].replace(/\+/g, '%20'))||null;
	};
	var data=getURLParameter("data"),
	    login_money=getURLParameter("login_money"),
	    sessionId=getURLParameter("sessionId"),
	    customerNo=getURLParameter("customerNo"),
	    tel=getURLParameter("tel"),
	    orderNo=getURLParameter("orderNo"),
	    mallId=getURLParameter("mallId"),
	    notifyUrl=getURLParameter("notifyUrl"),
		customerNameCN=getURLParameter("customerNameCN");
	    //console.log(customerNameCN);
	//back
	$("#back_last").on("click",function(){
		var str="login_money="+login_money;
		var publicStr=publicKey(str);
		window.location.href="../views/login.html?"+publicStr;
	});
	//设置支付金额
	function fmoney(s, n) { 
		n = n > 0 && n <= 20 ? n : 2; 
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
		var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1]; 
		t = ""; 
		for (i = 0; i < l.length; i++) { 
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
		} 
		return t.split("").reverse().join("") + "." + r; 
	} 
    $("#money").text( fmoney(login_money, 2));
	//创建订单
	var parms_one = {};
	parms_one.sessionId=sessionId;
	parms_one.customerNo=customerNo;
	parms_one.orderNo=orderNo;//商城订单号test///////////
	parms_one.mallId=mallId;//生产888100015200298///测试888121039980063/888100057120301
	parms_one.orderAmt=login_money;//支付金额////////////////////
	parms_one.goodsInf="";
	parms_one.goodsNum="";
	parms_one.notifyUrl=notifyUrl;///http://ohepay.com/service/PublicPayAction.commonNotifyUrl.do////
	//parms_one.returnUrl = "http://192.168.132.133:8084/service/PublicPayAction.payWayQuery.do";
	parms_one.channelType = "004";
	$.ajax({
		url :getRootPath()+"/PublicPayAction.sdkCreatePayOrder.do?FAPView=JSON",
		data : parms_one,
		success : function(data) {
			var data=$.parseJSON(data);
			//console.log(data);
			if(data.FAPStatus=="0"){
				if(data.success==true){
					var orderNo=data.data.transactionOrderDetail.orderNo;
					var payCstNo=data.data.transactionOrderDetail.payCstNo;
					var trxAmount=data.data.transactionOrderDetail.trxAmount;//金额
					var orderSerialNo=data.data.transactionOrderDetail.orderSerialNo;//流水号
					var tranflow = data.data.transactionOrderDetail.orderSerialNo;
					var customerNo=parms_one.customerNo;
					var sessionId=parms_one.sessionId;
					var orderType=data.data.transactionOrderDetail.orderType;
					var mallId=data.data.transactionOrderDetail.mallId;
					payAllList(orderSerialNo,payCstNo,trxAmount,orderSerialNo,tranflow,customerNo,sessionId,orderType,mallId,orderNo);	
				}else{
					$(".login_mask").css("display","block").text(data.errors.msg);
	    			 setTimeout(function(){
						$(".login_mask").css("display","none");
					},2000);
				}
			}else{
				if(data.FAPErrorMessage){
					if(data.FAPErrorMessage.replace(/\s+/g,'').substring(0,2)=="no"){
						$(".login_mask").css("display","block").text("请重新登录");
		    			 setTimeout(function(){
							$(".login_mask").css("display","none");
						},2000);
					}else{
						$(".login_mask").css("display","block").text(data.FAPErrorMessage);
		    			 setTimeout(function(){
							$(".login_mask").css("display","none");
						},2000);
					}
				}else{
					if(data.errorCode){
						$(".login_mask").css("display","block").text(data.errorCode);
		    			 setTimeout(function(){
							$(".login_mask").css("display","none");
						},2000);
					}else{
						$(".login_mask").css("display","block").text(data.FAPErrorCode);
		    			 setTimeout(function(){
							$(".login_mask").css("display","none");
						},2000);
					}
				}
				
			}
		},
		error : function() {
			//location = "index.html";
		}	
	});
	//支付方式查询
	function payAllList(orderNo,payCstNo,trxAmount,orderSerialNo,tranflow,customerNo,sessionId,orderType,mallId,orderNo_shop){
		var params={};
		params.customerNo=customerNo;
		params.sessionId=sessionId;
		params.orderSerialNo=orderSerialNo;
		$.ajax({
			url :getRootPath()+"/PublicPayAction.payWayQuery.do?FAPView=JSON",
			data :params,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log("支付方式");
				//console.log(data);
				if(data.FAPStatus=="0"){
					if(data.success==true){
						var black=data.balance;//余额
						var accType="01";//账户类型
						var payType="01";//支付类型
						/*PAY_TYPE_YE("钱包余额","01"),
						PAY_TYPE_YFK("预付卡","02"),
						PAY_TYPE_WX("微信","21"),
						PAY_TYPE_SBT("闪白条","22"),
						PAY_TYPE_ZFB("支付宝","25"),
						PAY_TYPE_BANK_WEB_QUICK("银行卡快捷","26");*/
						//封装判断支付
						Array.prototype.in_array = function (element) {  
						    for (var i = 0; i < this.length; i++) {  
						        if (this[i] == element) {  
						            return true;  
						        }  
						    }  
						    return false;  
						};  
						var payTypes=data.data.payTypes;
						if(payTypes.in_array('26') || payTypes.in_array('02')){
							if(payTypes.in_array('26')){
								$(".pay_list").prepend('<li>'
										+'<dl>'
							 				+'<dt><img src="'+imgSRC+'images/add.png"></dt>'
							 				+'<dd><h2 class="payment_main_pay_h2">添加银行卡支付</h2><span style="display:none" class="judge">addBank</span><span><img src="'+imgSRC+'images/radio@2x.png" class="payment_main_img"></span></dd>'
							 			+'</dl>'
							 		+'</li>');
							}
							pay_list(orderNo,payCstNo,trxAmount,orderSerialNo,tranflow,customerNo,sessionId,orderType,mallId,orderNo_shop);
							
						}if(payTypes.in_array('25')){
							$(".pay_list").prepend('<li>'
									+'<dl>'
						 				+'<dt><img src="'+imgSRC+'images/alipay@2x.png"></dt>'
						 				+'<dd><h2 class="payment_main_pay_h2">支付宝</h2><span style="display:none" class="judge">alipay</span><span><img src="'+imgSRC+'images/radio@2x.png" class="payment_main_img"></span></dd>'
						 			+'</dl>'
						 		+'</li>');
						}/*if(payTypes.in_array('22')){
							$(".pay_list").prepend('<li>'
									+'<dl>'
						 				+'<dt><img src="'+imgSRC+'images/baitiao@2x.png"></dt>'
						 				+'<dd><h2>闪白条</h2><p>最低消费<b id="lowMoney" style="font-weight:500;margin-left:0.5rem;">10</b>元</p><span style="display:none" class="judge">flashingWhite</span><span><img src="'+imgSRC+'images/radio@2x.png" class="payment_main_img"></span></dd>'
						 			+'</dl>'
						 		+'</li>');
						}*/if(payTypes.in_array('01')){
							$(".pay_list").prepend('<li id="pay_list">'
									+'<dl>'
						 				+'<dt><img src="'+imgSRC+'images/zhifu_03.png"></dt>'
						 				+'<dd><h2>全时钱包</h2><p>余额<b id="balance" style="font-weight:500;margin-left:0.5rem;"></b></p><span style="display:none" class="judge">fullTimeWallet</span><span><img src="'+imgSRC+'images/radio_s@2x.png" class="payment_main_img" id="only"></span></dd>'
						 			+'</dl>'
						 		+'</li>');
						}
					}else{
						$(".login_mask").css("display","block").text(data.errors.msg);
		    			 setTimeout(function(){
							$(".login_mask").css("display","none");
						},2000);
					}
				}else{
					if(data.FAPErrorMessage){
						if(data.FAPErrorMessage.replace(/\s+/g,'').substring(0,2)=="no"){
							$(".login_mask").css("display","block").text("请重新登录");
			    			 setTimeout(function(){
								$(".login_mask").css("display","none");
							},2000);
						}else{
							$(".login_mask").css("display","block").text(data.FAPErrorMessage);
			    			 setTimeout(function(){
								$(".login_mask").css("display","none");
							},2000);
						}
					}else{
						if(data.errorCode){
							$(".login_mask").css("display","block").text(data.errorCode);
			    			 setTimeout(function(){
								$(".login_mask").css("display","none");
							},2000);
						}else{
							$(".login_mask").css("display","block").text(data.FAPErrorCode);
			    			 setTimeout(function(){
								$(".login_mask").css("display","none");
							},2000);
						}
					}
					
				}
			},
			error : function() {
				//location = "index.html";
			}	
		});
	}
	var payIndex;
	//判断支付方式 
	function pay_list(orderNo,payCstNo,trxAmount,orderSerialNo,tranflow,customerNo,sessionId,orderType,mallId,orderNo_shop){
		$(".payment_main_pay ul li").live("click",function(){
			payIndex=$(this).index();
			var check=$(this).find(".payment_main_img").attr("src");
			//设置选择方式
			if(check=="../images/radio@2x.png"){
				$(this).find(".payment_main_img").attr("src",imgSRC+"images/radio_s@2x.png").parents("li").siblings().find("dd img").attr("src",imgSRC+"images/radio@2x.png");
			};
		});
		//初始化查询钱包余额
		var params = {};
		params.customerNo = payCstNo;//钱包账号
		params.orderType = orderType;//支付类型
		params.orderNo = orderNo;//订单流水号
		params.orderAmt =trxAmount;//订单金额
		params.sessionId = sessionId;
		$.ajax({
			url :getRootPath()+"/PrepaidCardAction.cardQuery.do?FAPView=JSON",
			data : params,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus=="0"){
					if(data.success==true){
						var data=data.data;
						var black=data.avabalance;//余额
						var accType="01";//账户类型
						var payType="01";//支付类型
						$("#balance").text(new Number(black).toFixed(2));
						var bankcard_list = data.bankcard.length;
						var cdcard_list = data.cdcard.length;
						for(var i=0;i<bankcard_list;i++){
							var ACCOUNTNO = data.bankcard[i].ACCOUNTNO//卡号
							var ACCOUNTNO_last = ACCOUNTNO.substr(ACCOUNTNO.length-4);
							var BANKNAME = data.bankcard[i].BANKNAME;//银行名称
							var phoneNum = data.bankcard[i].MOBILE;//预留手机号
							var img="";
							img=bankCard(BANKNAME,img);
							if($("#pay_list")){
								$("#pay_list").after('<li>'
										+'<dl>'
							 				+'<dt><img src='+img+'></dt>'
							 				+'<dd><h2 class="payment_main_pay_h2"><label>'+BANKNAME+'</label>('+ACCOUNTNO_last+')</h2><span style="display:none" class="judge">bank</span><span><img src="'+imgSRC+'images/radio@2x.png" class="payment_main_img"><i style="display:none;">'+ACCOUNTNO+'</i><b style="display:none;" class="phoneNum">'+phoneNum+'</b></span></dd>'
							 			+'</dl>'
							 		+'</li>');
							}else{
								$(".pay_list").prepend('<li>'
										+'<dl>'
							 				+'<dt><img src='+img+'></dt>'
							 				+'<dd><h2 class="payment_main_pay_h2"><label>'+BANKNAME+'</label>('+ACCOUNTNO_last+')</h2><span style="display:none" class="judge">bank</span><span><img src="'+imgSRC+'images/radio@2x.png" class="payment_main_img"><i style="display:none;">'+ACCOUNTNO+'</i><b style="display:none;">'+phoneNum+'</b></span></dd>'
							 			+'</dl>'
							 		+'</li>');
							}
							
						}
						//console.log($(".payment_main_pay li").find("img").attr("src"));
						for(var i=0;i<cdcard_list;i++){
							var BALANCE = data.cdcard[i].BALANCE;//余额
							var CARDNO = data.cdcard[i].CARDNO;//卡号
							var CARDNO_last = CARDNO.substr(CARDNO.length-4);
							if($("#pay_list")){
								$("#pay_list").after('<li>'
										+'<dl>'
							 				+'<dt><img src="'+imgSRC+'images/quanshitongka@2x.png"></dt>'
							 				+'<dd><h2><label>全时通卡</label>('+CARDNO_last+')</h2><p>余额<b id="balance_next" class="balance_next" style="font-weight:500;margin-left:0.5rem;">'+BALANCE+'</b></p><span style="display:none" class="judge" data-sub="'+i+'">fullTimeCard</span><span><img src="'+imgSRC+'images/radio@2x.png" class="payment_main_img"><i style="display:none;">'+CARDNO+'</i></span></dd>'
							 			+'</dl>'
							 		+'</li>');
							}else{
								$(".pay_list").prepend('<li>'
										+'<dl>'
							 				+'<dt><img src="'+imgSRC+'images/quanshitongka@2x.png"></dt>'
							 				+'<dd><h2><label>全时通卡</label>('+CARDNO_last+')</h2><p>余额<b id="balance_next" class="balance_next" style="font-weight:500;margin-left:0.5rem;">'+BALANCE+'</b></p><span style="display:none" class="judge" data-sub="'+i+'">fullTimeCard</span><span><img src="'+imgSRC+'images/radio@2x.png" class="payment_main_img"><i style="display:none;">'+CARDNO+'</i></span></dd>'
							 			+'</dl>'
							 		+'</li>');
							}
							
						}
						payment(orderNo,payCstNo,trxAmount,orderSerialNo,tranflow,customerNo,sessionId,orderType,mallId,black,accType,payType,orderNo_shop);
					}else{
						$(".login_mask").css("display","block").text(data.errors.msg);
		    			 setTimeout(function(){
							$(".login_mask").css("display","none");
						},2000);
					}
				}else{
					if(data.FAPErrorMessage){
						if(data.FAPErrorMessage.replace(/\s+/g,'').substring(0,2)=="no"){
							$(".login_mask").css("display","block").text("请重新登录");
			    			 setTimeout(function(){
								$(".login_mask").css("display","none");
							},2000);
						}else{
							$(".login_mask").css("display","block").text(data.FAPErrorMessage);
			    			 setTimeout(function(){
								$(".login_mask").css("display","none");
							},2000);
						}
					}else{
						if(data.errorCode){
							$(".login_mask").css("display","block").text(data.errorCode);
			    			 setTimeout(function(){
								$(".login_mask").css("display","none");
							},2000);
						}else{
							$(".login_mask").css("display","block").text(data.FAPErrorCode);
			    			 setTimeout(function(){
								$(".login_mask").css("display","none");
							},2000);
						}
					}
					
				}
				
			},
			error : function() {
				//location = "index.html";
			}
		});
		//点击确认支付 判断选中的支付方式
		function payment(orderNo,payCstNo,trxAmount,orderSerialNo,tranflow,customerNo,sessionId,orderType,mallId,black,accType,payType,orderNo_shop){
			var li=$(".payment_main_pay").find("li");
			for(var i=0;i<li.length;i++){
				var text1=li.eq(i).find("h2");
				var src=text1.siblings("span").find(".payment_main_img");
				if(text1.text()==data){
					//console.log(text1.text());
					src.attr("src",imgSRC+"images/radio_s@2x.png").parents("li").siblings().find("dd img").attr("src",imgSRC+"images/radio@2x.png");
				}
			}
			$("#payment_main_pay_sure1").live("click",function() {
				for(var i=0;i<li.length;i++){
					var img=li.eq(i).find(".payment_main_img");
					if(img.attr("src")==imgSRC+"images/radio_s@2x.png"){
						var text=img.parent("span").siblings("h2").text();
						var text_next=img.parent("span").siblings("h2").find("label").text();
						var judge=img.parent("span").siblings(".judge").text();
						//console.log(judge);
						if(judge=="alipay"){
							var parms_two = {};
							parms_two.WIDout_trade_no = orderSerialNo;//订单号
							parms_two.WIDsubject = "测试";//订单名称
							parms_two.WIDtotal_fee= trxAmount;//订单金额；
							parms_two.WIDshow_url = document.URL;//商品展示网址 
							parms_two.WIDbody = "ooo";//商品描述
							parms_two.customerNo = customerNo;
							parms_two.orderNo=orderNo;
							parms_two.orderAmt = trxAmount;
							parms_two.mallId = mallId;
							$.ajax({
								url :getRootPath()+"/AliPayAction.aliPay.do?FAPView=JSON",
								data : parms_two,
								success : function(data) {
									var data=$.parseJSON(data);
									if(data.FAPStatus=="0"){
										if(data.success==true){
											var data=data.data;
											//console.log(data);
											var WIDout_trade_no = data.WIDout_trade_no;
											var WIDsubject = data.WIDsubject;
											var WIDtotal_fee = data.WIDtotal_fee;
											var WIDshow_url = data.WIDshow_url;
											var WIDbody = data.WIDbody;
//											location.href=getRootPath()+"/alipayapi.jsp?WIDout_trade_no="+WIDout_trade_no+"&WIDsubject="+WIDsubject+"&WIDtotal_fee="+WIDtotal_fee+"&WIDshow_url="+WIDshow_url+"&WIDbody="+WIDbody+"&orderNo="+orderNo
//											+"&mallId="+mallId+"&customerNo="+customerNo+"&orderAmt="+trxAmount;
											location.href=getRootPath()+"/alipayapi.jsp?WIDout_trade_no="+WIDout_trade_no+"&WIDsubject="+WIDsubject+"&WIDtotal_fee="+WIDtotal_fee+"&WIDshow_url="+WIDshow_url+"&WIDbody="+WIDbody+"&orderNo="+orderNo
											+"&mallId="+mallId+"&customerNo="+customerNo+"&orderAmt="+trxAmount;	
										}else{
											$(".login_mask").css("display","block").text(data.errors.msg);
							    			 setTimeout(function(){
												$(".login_mask").css("display","none");
											},2000);
										}
									}else{
										if(data.FAPErrorMessage){
											if(data.FAPErrorMessage.replace(/\s+/g,'').substring(0,2)=="no"){
												$(".login_mask").css("display","block").text("请重新登录");
								    			 setTimeout(function(){
													$(".login_mask").css("display","none");
												},2000);
											}else{
												$(".login_mask").css("display","block").text(data.FAPErrorMessage);
								    			 setTimeout(function(){
													$(".login_mask").css("display","none");
												},2000);
											}
										}else{
											if(data.errorCode){
												$(".login_mask").css("display","block").text(data.errorCode);
								    			 setTimeout(function(){
													$(".login_mask").css("display","none");
												},2000);
											}else{
												$(".login_mask").css("display","block").text(data.FAPErrorCode);
								    			 setTimeout(function(){
													$(".login_mask").css("display","none");
												},2000);
											}
										}
									}
								},
								error : function() {
									//location = "index.html";
								}
							});
						}else if(judge=="flashingWhite"){//跳转至闪白条
							var lowMoney=$("#lowMoney").text();
							if(trxAmount<lowMoney){
								$(".login_mask").css("display","block").text("闪白条最低消费不低于10元");
				    			 setTimeout(function(){
									$(".login_mask").css("display","none");
								},2000);
							}else{
								var parms_three = {};  
								parms_three.amount=trxAmount;
								parms_three.description="123";
								parms_three.userAddr="123";
								parms_three.userMbl=tel;
								parms_three.userName="123";
								parms_three.customerNo = customerNo;
								parms_three.mercOrderNo=orderNo;
								parms_three.payType = "22";
								parms_three.channelType = "004";
								var webRoot = getRootPath();
							    var paramData = getUrlParam();
								//var url=webRoot+"/PayCallBackAction.getsbtSign.do?FAPView=JSON";
							    var url=webRoot+"/PublicPayAction.sbtGetSign.do?FAPView=JSON";
					        	$.ajax({  
				 			        type:'post',  
				 			        url : url, 
				 			        data:parms_three,
				 			        dataType : 'json',  
				 			       // jsonp:"sbtJsonCallBack",  
				 			        success  : function(data) {  
				 			        	//console.log(data);
				 			        	if(data.FAPStatus=="0"){
											if(data.success==true){
												var d=data.data.data;
	//								 			 console.log(data);
						 			              //console.log(d);
							 			          var params="amount="+d.amount+"&charset="+d.charset+"&description="+d.description
							 			          +"&hmac="+d.hmac+"&interfaceName="+d.interfaceName
							 			          +"&mercId="+d.mercId+"&mercOrderNo="+d.mercOrderNo+"&mercResv="+d.mercResv
							 			          +"&notifyUrl="+d.notifyUrl+"&pageUrl="+d.pageUrl+"&signType="+d.signType
							 			          +"&userAddr="+d.userAddr+"&userMbl="+d.userMbl+"&userName="+d.userName
							 			          +"&validTime="+d.validTime+"&version="+d.version;
			 				 			         var aa=data.data.placeOrder+"?"+params;
			 				 			         //生产地址：http://weixin.9fbaitiao.cn/portal/ips/index
			 				 			         //测试地址：http://weixin.shancard.cn/portal/ips/index
	//								 			         location.href=webRoot+"PayCallBackAction.sbtCallBack.do?"+params;
			 				 			         location.href=aa;	
											}else{
												$(".login_mask").css("display","block").text(data.errors.msg);
								    			 setTimeout(function(){
													$(".login_mask").css("display","none");
												},2000);
											}
										}else{
											if(data.FAPErrorMessage){
												if(data.FAPErrorMessage.replace(/\s+/g,'').substring(0,2)=="no"){
													$(".login_mask").css("display","block").text("请重新登录");
									    			 setTimeout(function(){
														$(".login_mask").css("display","none");
													},2000);
												}else{
													$(".login_mask").css("display","block").text(data.FAPErrorMessage);
									    			 setTimeout(function(){
														$(".login_mask").css("display","none");
													},2000);
												}
											}else{
												if(data.errorCode){
													$(".login_mask").css("display","block").text(data.errorCode);
									    			 setTimeout(function(){
														$(".login_mask").css("display","none");
													},2000);
												}else{
													$(".login_mask").css("display","block").text(data.FAPErrorCode);
									    			 setTimeout(function(){
														$(".login_mask").css("display","none");
													},2000);
												}
											}
										}
				 			          
				 			        },  
				 			        error : function(aa,bb,cc) {  debugger;
				 			            alert('fail');  
				 			        }  
					 			});
							}
							  
						}else if(judge=="addBank"){
							//添加银行卡
							//if(trxAmount<=100.00){
								var str="customerNameCN="+customerNameCN+"&customerNo="+customerNo+"&sessionId="+sessionId+"&orderSerialNo="+orderSerialNo+"&tel="+tel+"&trxAmount="+trxAmount+"&orderNo_shop="+orderNo_shop+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
			 					var publicStr=publicKey(str);
								location.href=encodeURI("../views/add_bank.html?"+publicStr);
							//}else{
								//alert(2);
							//}
						}else if(judge=="fullTimeWallet"){
							//全时钱包
							var balance=$("#balance").text();
							var login_money=trxAmount;
							if(balance<login_money){
								$(".login_mask").css("display","block").text("钱包余额不足");
								setTimeout(function(){
									$(".login_mask").css("display","none");
								},2000);
							}else{
								var str="judge="+judge+"&payCstNo="+payCstNo+"&data="+text+"&mallId="+mallId+"&customerNo="+customerNo+"&sessionId="+sessionId+"&orderSerialNo="+orderSerialNo+"&trxAmount="+trxAmount+"&black="+black+"&accType="+accType+"&payType="+payType+"&orderNo="+orderNo+"&transflow="+orderSerialNo+"&tel="+tel+"&orderNo_shop="+orderNo_shop+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
			 					var publicStr=publicKey(str);
								location.href=encodeURI("../views/order.html?"+publicStr);
							}
							
						}else if(judge=="fullTimeCard"){
							//全时通卡
							//console.log(payIndex);
							var balance=$(".payment_main_pay ul li").eq(parseInt(payIndex)).find(".balance_next").text();
							var login_money=trxAmount;
							var cardNo=img.next().text();
							//console.log(balance);
							if(balance<login_money){
								$(".login_mask").css("display","block").text("全时通卡余额不足");
								setTimeout(function(){
									$(".login_mask").css("display","none");
								},2000);
							}else{
								var str="judge="+judge+"&payCstNo="+payCstNo+"&data="+text_next+"&mallId="+mallId+"&customerNo="+customerNo+"&sessionId="+sessionId+"&orderSerialNo="+orderSerialNo+"&trxAmount="+trxAmount+"&black="+black+"&accType="+accType+"&payType="+payType+"&orderNo="+orderNo+"&transflow="+orderSerialNo+"&tel="+tel+"&cardNo="+cardNo+"&orderNo_shop="+orderNo_shop+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
			 					var publicStr=publicKey(str);
								location.href=encodeURI("../views/order.html?"+publicStr);
							}
						}else{//银行卡支付
							var accountNo = img.next().text();
							var phoneNum = $(".pay_list").find(".phoneNum").text();
							//console.log(phoneNum)
							var str="judge="+judge+"&payCstNo="+payCstNo+"&data="+text+"&mallId="+mallId+"&customerNo="+customerNo+"&sessionId="+sessionId+"&orderSerialNo="+orderSerialNo+"&trxAmount="+trxAmount+"&black="+black+"&accType="+accType+"&payType="+payType+"&orderNo="+orderNo+"&transflow="+orderSerialNo+"&tel="+tel+"&orderNo_shop="+orderNo_shop+"&mallId="+mallId+"&notifyUrl="+notifyUrl+"&accountNo="+accountNo+"&phoneNum="+tel;
		 					var publicStr=publicKey(str);
							location.href=encodeURI("../views/order.html?"+publicStr);
						}
					}
					
				}
			});
		};
	};
})(jQuery);