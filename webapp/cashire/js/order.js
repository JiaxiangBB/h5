;(function($){	
	//order页面的显示
	//解析参数
	var url = window.location.search;
	var str = url.substr(1);
	var privateStr="?"+privateKey(str);
	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(privateStr)||[,""])[1].replace(/\+/g, '%20'))||null;
	};
	
	function auto(){
		var value="";
		for(var i=1;i<=4;i++){
			value+=Math.floor(Math.random()*10);
		}
		return value;
	}
	var customerNo=getURLParameter("customerNo");
	var sessionId=getURLParameter("sessionId");
	var orderSerialNo=getURLParameter("orderSerialNo");
	var text=getURLParameter("data");
	var judge=getURLParameter("judge");
	var orderNo=getURLParameter("orderNo");
	var orderNo_shop=getURLParameter("orderNo_shop");
	var mallId=getURLParameter("mallId");
	var notifyUrl=getURLParameter("notifyUrl");
	var transflow = getURLParameter("transflow");//流水号
	var trxAmount=getURLParameter("trxAmount");//金额
	var mallId = getURLParameter("mallId");
	var payCstNo=getURLParameter("payCstNo");//钱包账号
	var tel = getURLParameter("tel");//手机号
	var black = getURLParameter("black");//余额
	var accType = getURLParameter("accType");//账户类型
	var payType = getURLParameter("payType");//支付类型
	var cardNo = getURLParameter("cardNo");//全时通卡号
	var accountNo = getURLParameter("accountNo");//银行卡号
	var phoneNum = getURLParameter("phoneNum");//预留手机号
	//console.log(privateStr)
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
	$("#menu").text(orderSerialNo);
	$("#money").text(tel);
	$("#pay").text(fmoney(trxAmount, 2));
	$("#list_wrap").find("label").text(text);
	//判断支付方式
	(function(){
		$(".queren").removeAttr("disabled");
		$(".queren").on("click",function(){
			$(this).attr('disabled',"true");
			if(judge=="fullTimeWallet" || judge=="fullTimeCard"){//跳转至全时钱包
				var str="payCstNo="+payCstNo+"&text="+text+"&mallId="+mallId+"&customerNo="+customerNo+"&sessionId="+sessionId+"&orderSerialNo="+orderSerialNo+"&trxAmount="+trxAmount+"&black="+black+"&accType="+accType+"&payType="+payType+"&orderNo="+orderNo+"&transflow="+transflow+"&tel="+tel+"&cardNo="+cardNo+"&orderNo_shop="+orderNo_shop+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
				var publicStr=publicKey(str);
				location.href=encodeURI("../views/cashier.html?"+publicStr);
				$(".queren").removeAttr("disabled");
			}else{
				var encryption="accountNo="+encryptByDES(accountNo)+"&channelType=004&customerNo="+customerNo+"&orderSerialNo="+orderSerialNo+"&payType=26";
				console.log(encryption);
				var parms = {};
				parms.customerNo = customerNo;
				parms.sessionId = sessionId;
				parms.orderSerialNo = orderSerialNo;
				/*parms.tel = encryptByDES(tel);
				parms.trxAmount = trxAmount;*/
				parms.accountNo = encryptByDES(accountNo);
				parms.payType = "26";
				parms.channelType = "004";
				parms.signKey=publicKeyRSA(md5(encryption));
				$.ajax({
					url :getRootPath()+"/PublicPayAction.bankCardHasQuickPayRequest.do?FAPView=JSON",
					data : parms,
					success : function(data) {
						var data=$.parseJSON(data);
						console.log(data);
						if(data.FAPStatus=="0"){
							if(data.success==true){
								if(data.data.authenticateStatus=="0"){
									//console.log(data);
									var orderSerialNo=data.data.orderNo;
									var str="customerNo="+customerNo+"&accountNo="+accountNo+"&sessionId="+sessionId+"&trxAmount="+trxAmount+"&tel="+tel+"&orderSerialNo="+orderSerialNo+"&cardNo="+accountNo+"&orderNo_shop="+orderNo_shop+"&mallId="+mallId+"&phoneNum="+phoneNum+"&notifyUrl="+notifyUrl;
									var publicStr=publicKey(str);
									location.href="../views/add_bank3.html?"+publicStr;
									$(".queren").removeAttr("disabled");
								}else{
									if(data.data.errMsg){
										$(".login_mask").css("display","block").text(data.data.errMsg);
									}else{
										$(".login_mask").css("display","block").text(data.data.err_msg);
									}
									setTimeout(function(){
										$(".login_mask").css("display","none");
										$(".queren").removeAttr("disabled");
									},2000);
								}
							}else{
								$(".login_mask").css("display","block").text(data.errors.msg);
				    			 setTimeout(function(){
									$(".login_mask").css("display","none");
									$(".queren").removeAttr("disabled");
								},2000);
							}
							
						}else{
							if(data.FAPErrorMessage){
								if(data.FAPErrorMessage.replace(/\s+/g,'').substring(0,2)=="no"){
									$(".login_mask").css("display","block").text("请重新登录");
					    			 setTimeout(function(){
										$(".login_mask").css("display","none");
										$(".queren").removeAttr("disabled");
									},2000);
								}else{
									$(".login_mask").css("display","block").text(data.FAPErrorMessage);
					    			 setTimeout(function(){
										$(".login_mask").css("display","none");
										$(".queren").removeAttr("disabled");
									},2000);
								}
							}else{
								if(data.errorCode){
									$(".login_mask").css("display","block").text(data.errorCode);
					    			 setTimeout(function(){
										$(".login_mask").css("display","none");
										$(".queren").removeAttr("disabled");
									},2000);
								}else{
									$(".login_mask").css("display","block").text(data.FAPErrorCode);
					    			 setTimeout(function(){
										$(".login_mask").css("display","none");
										$(".queren").removeAttr("disabled");
									},2000);
								}
							}
							
						}
						//console.log(data);	
					},
					error : function(){
						//location = "index.html";
					}
				});
			}
		});
		//返回
		$("#back").on("click",function(){
			var str="customerNo="+customerNo+"&sessionId="+sessionId+"&data="+text+"&login_money="+trxAmount+"&tel="+tel+"&orderNo="+orderNo_shop+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
			var publicStr=publicKey(str);
			window.location.href="../views/payment.html?"+publicStr;
		});		
	}());
})(jQuery);