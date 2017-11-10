//解析参数
var url = window.location.search;
var str = url.substr(1);
var privateStr="?"+privateKey(str);
console.log(str);

//URL解析参数
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 
var orderAmt=getQueryString("orderAmt");//付款金额
var orderSerialNo=getQueryString("orderSerialNo");//订单流水号
var payType =getQueryString("payType");//付款方式 全时通卡/余额
var customerNo = getQueryString("customerNo");//客户号
var notifyUrl = getQueryString("notifyUrl");//回调地址
var channel = getQueryString("channel");
var mallId = getQueryString("mallId");
var md5info = getQueryString("md5info");
console.log(orderAmt)
console.log(orderSerialNo);
console.log(payType)

// function getURLParameter(name) {
// 	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(privateStr)||[,""])[1].replace(/\+/g, '%20'))||null;
// };
	// var payCstNo=getURLParameter("payCstNo");
	// var text=getURLParameter("text");
	// var customerNo=getURLParameter("customerNo");
	// var orderSerialNo=getURLParameter("orderSerialNo");
	// var sessionId=getURLParameter("sessionId");
	// var trxAmount=getURLParameter("trxAmount");
	// var accType=getURLParameter("accType");
	// var payType=getURLParameter("payType");
	// var orderNo=getURLParameter("orderNo");
	// var tel=getURLParameter("tel");
	// var black=getURLParameter("black");
	// var cardNo=getURLParameter("cardNo");
	// var orderNo_shop=getURLParameter("orderNo_shop");
	// var mallId=getURLParameter("mallId");
	// var notifyUrl=getURLParameter("notifyUrl");
////设置支付金额 保留小数点后两位
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
//付款金额
$(".payment_main_money").find("label").text(fmoney(orderAmt,2));
// //返回选择支付方式页面
// $("#back_order").on("click",function(){
// 	var str="login_money="+trxAmount+"&customerNo="+customerNo+"&sessionId="+sessionId+"&tel="+tel+"&orderNo="+orderNo_shop+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
// 	var publicStr=publicKey(str);
// 	window.location.href="../views/payment.html?"+publicStr;
// })
//动画
$(function(){
	var i=0;
	var timer=null;
	$('.mask_in p span').eq(0).addClass("mask_in_span");
	function myfun(id){
		$('.mask_in p span').eq(id).addClass("mask_in_span").siblings().removeClass("mask_in_span")
	}
	function auto(){
		if(i>=$('.mask_in p span').length)i=0;
		$('.mask_in p span').eq(0).addClass("mask_in_span").siblings().removeClass("mask_in_span");
		i++;	
		myfun(i);
	}timer=setInterval(auto,250)
});
if(payType=="01"){//余额支付
	//输入密码
	$(window).ready(function() {
	    $(".i-text").keyup(function(){
			var inp_v = $(this).val();
			var inp_l = inp_v.length;
			//$("h3").html( "input的值为：" + inp_v +"; " + "值的长度为:" + inp_l);//测试用
			//console.log(inp_v)
			for( var x = 0; x<=6; x++)
			{
				//$("h3").html( inp_l );//测试
				
				$(".sixDigitPassword").find("i").eq( inp_l ).addClass("active").siblings("i").removeClass("active");
				$(".sixDigitPassword").find("i").eq( inp_l ).prevAll("i").find("b").css({"display":"block"});
				$(".sixDigitPassword").find("i").eq( inp_l - 1 ).nextAll("i").find("b").css({"display":"none"});
				
				if( inp_l == 0)
				{
					$(".sixDigitPassword").find("i").eq( 0 ).addClass("active").siblings("i").removeClass("active");
					$(".sixDigitPassword").find("b").css({"display":"none"});
				}
				else if( inp_l == 6)
				{
					$(".sixDigitPassword").find("b").css({"display":"block"});
					$(".sixDigitPassword").find("i").eq(5).addClass("active").siblings("i").removeClass("active");
				}
					
			}
			if(inp_l==6){
				//判断密码输入完成
				(function(){
					$(".mask").css("display","block").siblings(".mask_all").css("display","block").find(".mask_in").css("display","block");
					//检测密码
					function isPsw() {
						var psw = inp_v;
					    var rules = /^\d{6}$/;
					    return rules.test(psw);
					};
					if(isPsw()==true){
							console.log(inp_v);
							var encryption="accNo=&accType="+accType+"&bankId=&channelType=004&customerNo="+customerNo+"&orderSerialNo="+orderSerialNo+"&payPwd="+encryptByDES(inp_v)+"&payType=01&touchID=";
							var params = {};
							params.customerNo = customerNo;//客户号
							params.orderSerialNo = orderSerialNo;//订单流水号
							params.payPwd=encryptByDES(inp_v);//支付密码
							params.sessionId = sessionId;//sessionId
							params.payType = "01";//支付类型
							params.accType=accType;//账户类型
							params.channelType = "004";
							params.bankId="";
							params.accNo="";
							params.touchID="";
							params.signKey=publicKeyRSA(md5(encryption));
							console.log(params);
							$.ajax({
								url : getRootPath()+"/PublicPayAction.sdkorderPay.do?FAPView=JSON",
								data : params,
								success : function(data) {
									var data=$.parseJSON(data);
									//console.log(data);
									//console.log(inp_v);
									var orderAmt = trxAmount//支付金额
									if(data.FAPStatus==0){
										if(data.success==true){
											var data=data.data;
											$(".mask_in").css("display","none").siblings(".mask_success").css("display","block");
											setTimeout(function(){
					 	    					$(".mask_success").css("display","none");
					 	    				},2000);
											setTimeout(function(){
												var str="trxAmount="+orderAmt+"&orderNo="+orderNo+"&payCstNo="+payCstNo+"&data="+text+"&customerNo="+customerNo+"&sessionId"+sessionId+"&orderSerialNo="+params.orderSerialNo+"&tel="+tel;
												var publicStr=publicKey(str);
												location.href=encodeURI("../views/back.html?"+publicStr);
											},2000);
										}else{
											$(".mask_all").css("display","none").siblings(".mask").css("display","none");
											$(".login_mask").css("display","block").text(data.errors.msg);
							    			 setTimeout(function(){
												$(".login_mask").css("display","none");
											},2000);
							    			$(".i-text").val("");
							    			$(".sixDigitPassword").find("i").removeClass("active");
							    			$(".sixDigitPassword").find("b").css({"display":"none"});
										}
									}else{
										$(".i-text").val("");
										$(".sixDigitPassword").find("i").removeClass("active");
										$(".sixDigitPassword").find("b").css({"display":"none"});
										if(data.FAPErrorMessage){
											if(data.FAPErrorMessage.replace(/\s+/g,'').substring(0,2)=="no"){
												$(".mask_all").css("display","none").siblings(".mask").css("display","none");
												$(".login_mask").css("display","block").text("请重新登录");
						 		    			 setTimeout(function(){
						 	    					$(".login_mask").css("display","none");
						 	    				},2000);
											}else{
												$(".mask_all").css("display","none").siblings(".mask").css("display","none");
												$(".login_mask").css("display","block").text(data.FAPErrorMessage);
						 		    			 setTimeout(function(){
						 	    					$(".login_mask").css("display","none");
						 	    				},2000);
											}	
										}else{
											if(data.errorCode){
												$(".mask_all").css("display","none").siblings(".mask").css("display","none");
												$(".login_mask").css("display","block").text(data.errorCode);
								    			 setTimeout(function(){
													$(".login_mask").css("display","none");
												},2000);
											}else{
												$(".mask_all").css("display","none").siblings(".mask").css("display","none");
												$(".login_mask").css("display","block").text(data.FAPErrorCode);
								    			 setTimeout(function(){
													$(".login_mask").css("display","none");
												},2000);
											}
										}
									}	
								},error:function(){
									//location = "index.html";
								}
							});	
					}else{
						$(".mask_all").css("display","none").siblings(".mask").css("display","none");
						$(".login_mask").css("display","block").text("支付密码格式错误，请重试");
		    			setTimeout(function(){
	    					$(".login_mask").css("display","none");
	    				},2000);
					}
				}());
			}
		});
	});
}else if(payType == "02"){//全时通卡
	//输入密码
	$(window).ready(function() {
	    $(".i-text").keyup(function(){
			var inp_v = $(this).val();
			var inp_l = inp_v.length;
			//$("h3").html( "input的值为：" + inp_v +"; " + "值的长度为:" + inp_l);//测试用
			
			for( var x = 0; x<=6; x++){
				//$("h3").html( inp_l );//测试
				$(".sixDigitPassword").find("i").eq( inp_l ).addClass("active").siblings("i").removeClass("active");
				$(".sixDigitPassword").find("i").eq( inp_l ).prevAll("i").find("b").css({"display":"block"});
				$(".sixDigitPassword").find("i").eq( inp_l - 1 ).nextAll("i").find("b").css({"display":"none"});
				
				if( inp_l == 0){
					$(".sixDigitPassword").find("i").eq( 0 ).addClass("active").siblings("i").removeClass("active");
					$(".sixDigitPassword").find("b").css({"display":"none"});
				}
				else if( inp_l == 6){
					$(".sixDigitPassword").find("b").css({"display":"block"});
					$(".sixDigitPassword").find("i").eq(5).addClass("active").siblings("i").removeClass("active");
				}
					
			}
			if(inp_l==6){
				//判断密码输入完成
				console.log(inp_v);
				(function(){
					$(".mask").css("display","block").siblings(".mask_all").css("display","block").find(".mask_in").css("display","block");
					//检测密码
					function isPsw() {
						var psw = inp_v;
					    var rules = /^\d{6}$/;
					    return rules.test(psw);
					};
					if(isPsw()==true){
						//var encryption="cardNo="+encryptByDES(cardNo)+"&cardPayPwd=&channelType=004&customerNo="+customerNo+"&mobileValidateCode=&orderSerialNo="+orderSerialNo+"&payPwd="+encryptByDES(inp_v)+"&payType=02&precardPass=&touchID=01&validateCode=";
						var parms = {};
						//console.log(encryption);
						parms.customerNo = customerNo;//客户号
						parms.orderSerialNo = orderSerialNo;//订单流水号
						//parms.payPwd=encryptByDES(inp_v);//支付密码
						//parms.sessionId = sessionId;//sessionId
						parms.payPwd=encryptByDES(inp_v);//支付密码
						//parms.payPwd=inp_v;//支付密码
						parms.orderAmt = orderAmt;//sessionId
						parms.channel = channel;//支付类型
						parms.mallId = mallId;//全时通卡号
						parms.token = "";
						parms.notifyUrl = notifyUrl;
						parms.returnUrl = "";
						parms.md5info = md5info;
						console.log(parms);
						$.ajax({
							url : getRootPath()+"/BusinessEntraceAction.prepaidCardPay.do?FAPView=JSON",
							data : parms,
							success : function(data) {
								var data=$.parseJSON(data);
								console.log(data);
								//console.log(inp_v);
								// var orderAmt = trxAmount//支付金额
								if(data.FAPStatus==0){
									if(data.success==true){
										var data=data.data;
										var code = data.code;
										console.log(code);
										if(code == 1){//成功
											$(".mask_in").css("display","none").siblings(".mask_success").css("display","block");
											setTimeout(function(){
						    					$(".mask_all").css("display","none");
						    				},2000);

						    				setTimeout(function(){
												$(".mask_in").css("display","none");
												function init(callback) {
													  var u = navigator.userAgent;
													  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
													  console.log('the phone is :'+isiOS)
													  if (!isiOS) {
													    if (window.WebViewJavascriptBridge) {
													      callback(WebViewJavascriptBridge)
													    } else {
													      document.addEventListener(
													        'WebViewJavascriptBridgeReady',
													        function() {
													          callback(WebViewJavascriptBridge)
													        },
													        false
													      );
													    }
													  } else {
													    if (window.WebViewJavascriptBridge) {
													      return callback(WebViewJavascriptBridge);
													    }
													    if (window.WVJBCallbacks) {
													      return window.WVJBCallbacks.push(callback);
													    }
													    window.WVJBCallbacks = [callback];
													    var WVJBIframe = document.createElement('iframe');
													    WVJBIframe.style.display = 'none';
													    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
													    document.documentElement.appendChild(WVJBIframe);
													    setTimeout(function() {
													      document.documentElement.removeChild(WVJBIframe)
													    }, 0)
													  }
													}
													function registerHandler(name, fun) {
													  init(function(bridge) {
													    bridge.registerHandler(name, fun);
													  })
													}
													function callHandler(name, data, fun) {
													  init(function(bridge) {
													    bridge.callHandler(name, data, fun);
													  })
													}
												//customerNo=P100000525&orderSerialNo=20170814&orderAmt=0.01&channel=%221001%22&payPwd=999999&mallId=888100015200387&token=%22%22&notifyUrl=%22%22&returnUrl=%22%22&md5info=80778F587AFE3700BEA853C19AE48124
												//var str="trxAmount="+orderAmt+"&orderNo="+orderNo+"&payCstNo="+payCstNo+"&data="+text+"&customerNo="+customerNo+"&sessionId"+sessionId+"&orderSerialNo="+orderSerialNo+"&tel="+tel;
												//var publicStr=publicKey(str);
												//location.href=encodeURI("../views/back.html?"+str);
												//location.href="../views/back.html?"+str;
												var data = {
													"code":"1",
													"orderSerialNo":orderSerialNo,//订单号
													"orderAmt":orderAmt//付款金额

												}
								    			callHandler('onPayResult',data,function(res){

								    			})
											},2000);
										}else if(code == 2){//失败
											var msg = data.msg;
											// console.log(msg);
											$(".mask_in").css("display","none").siblings(".mask_error").css("display","block");
											$(".mask_error .again_try").text(msg);
											setTimeout(function(){
						    					$(".mask_all").css("display","none");
						    				},2000);
										}else if(code == 0){//交易处理中
											alert("交易处理中")
										}
									}else{
										$(".mask_all").css("display","none").siblings(".mask").css("display","none");
										$(".login_mask").css("display","block").text(data.errors.msg);
						    			 setTimeout(function(){
											$(".login_mask").css("display","none");
										},2000);
						    			 $(".i-text").val("");
						    			$(".sixDigitPassword").find("i").removeClass("active");
						    			$(".sixDigitPassword").find("b").css({"display":"none"});
									}
								}else{
									$(".i-text").val("");
					    			$(".sixDigitPassword").find("i").removeClass("active");
					    			$(".sixDigitPassword").find("b").css({"display":"none"});
									if(data.FAPErrorMessage){
										if(data.FAPErrorMessage.replace(/\s+/g,'').substring(0,2)=="no"){
											$(".mask_all").css("display","none").siblings(".mask").css("display","none");
											$(".login_mask").css("display","block").text("请重新登录");
					 		    			 setTimeout(function(){
					 	    					$(".login_mask").css("display","none");
					 	    				},2000);
										}else{
											$(".mask_all").css("display","none").siblings(".mask").css("display","none");
											$(".login_mask").css("display","block").text(data.FAPErrorMessage);
					 		    			 setTimeout(function(){
					 	    					$(".login_mask").css("display","none");
					 	    				},2000);
										}	
									}else{
										if(data.errorCode){
										$(".mask_all").css("display","none").siblings(".mask").css("display","none");
											$(".login_mask").css("display","block").text(data.errorCode);
							    			 setTimeout(function(){
												$(".login_mask").css("display","none");
											},2000);
										}else{
											$(".mask_all").css("display","none").siblings(".mask").css("display","none");
											$(".login_mask").css("display","block").text(data.FAPErrorCode);
						    			 	setTimeout(function(){
												$(".login_mask").css("display","none");
											},2000);
										}
									}
								}	
							},error:function(){
								//location = "index.html";
							}
						});
					}else{
						$(".mask_all").css("display","none").siblings(".mask").css("display","none");
						$(".login_mask").css("display","block").text("支付密码格式错误，请重试");
		    			setTimeout(function(){
	    					$(".login_mask").css("display","none");
	    				},2000);
					}
				}());
			}
		});
	});
}
