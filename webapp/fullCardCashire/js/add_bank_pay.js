
//解析参数，手机号和密码
var url = window.location.search;
var str = url.substr(1);
var privateStr="?"+privateKey(str);
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(privateStr)||[,""])[1].replace(/\+/g, '%20'))||null;
};
var customerNo=getURLParameter("customerNo");
var sessionId=getURLParameter("sessionId");
var orderSerialNo=getURLParameter("orderSerialNo");
var tel=getURLParameter("tel");
var trxAmount=getURLParameter("trxAmount");
var cardNo=getURLParameter("cardNo");
var orderNo_shop=getURLParameter("orderNo_shop");
var mallId=getURLParameter("mallId");
var notifyUrl=getURLParameter("notifyUrl");
var phoneNum=getURLParameter("phoneNum");
var accountNo=getURLParameter("accountNo");
//console.log(privateStr)
$(".phoneNum").text(phoneNum);
sign();
$(".sign_next_again").removeAttr("disabled");
$(".sign_next_again").on("click",function(){
	$(this).attr('disabled',"true");
	var encryption="accountNo="+encryptByDES(accountNo)+"&channelType=004&customerNo="+customerNo+"&orderSerialNo="+orderSerialNo+"&payType=26";
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
			//console.log(data);
			if(data.FAPStatus=="0"){
				if(data.success==true){
					if(data.data.authenticateStatus=="0"){
						sign();
					}else{
						$(".login_mask").css("display","block").text(data.data.err_msg);
		    			 setTimeout(function(){
							$(".login_mask").css("display","none");
						},2000);
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
			//console.log(data);	
		},
		error : function(){
			//location = "index.html";
		}
	});
});
//短信验证支付
$("#pay").on("click",function(){
	$(".sign_next_again").removeAttr("disabled");
	curCount=0;
	var message=$("#message").val();
	if(message==""){
		$(".login_mask").css("display","block").text("验证码不可为空");
		 setTimeout(function(){
			$(".login_mask").css("display","none");
		},2000);
	}else{
		var encryption="accountNo="+encryptByDES(cardNo)+"&customerNo="+customerNo+"&orderSerialNo="+orderSerialNo+"&payValidateCode="+encryptByDES(message);
		var params={};
		params.sessionId = sessionId;
		params.customerNo = customerNo;
		params.orderSerialNo = orderSerialNo;
		params.payValidateCode = encryptByDES(message);
		params.accountNo = encryptByDES(cardNo);
		params.signKey=publicKeyRSA(md5(encryption));
		console.log(encryptByDES(cardNo));
		//console.log(md5(encryption));
		//console.log(params.signKey);
		$.ajax({
			url :getRootPath()+"/PublicPayAction.bankCardHasQuickPayConfirm.do?FAPView=JSON",
			data : params,      
			success : function(data) {
				var data=$.parseJSON(data);
				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.tradeStatus==0){
							var order_no=data.data.orderNo;
							var str="trxAmount="+trxAmount+"&orderSerialNo="+order_no+"&tel="+tel;
		 					var publicStr=publicKey(str);
							location.href=encodeURI("../views/back.html?"+publicStr);
						}else if(data.data.tradeStatus==1){
							$(".login_mask").css("display","block").text("交易正在处理");
			    			 setTimeout(function(){
								$(".login_mask").css("display","none");
							},2000);
						}else{
							$(".login_mask").css("display","block").text(data.data.errMsg);
			    			 setTimeout(function(){
								$(".login_mask").css("display","none");
							},2000);
						}
						
					}else{
						$(".login_mask").css("display","block").text(data.errors.msg);
		    			 setTimeout(function(){
							$(".login_mask").css("display","none");
						},2000);
					}
				}else{
					$(".login_mask").css("display","block").text(data.FAPErrorMessage);
	    			 setTimeout(function(){
						$(".login_mask").css("display","none");
					},2000);
				}				
			},
			error : function() {
				//location = "index.html";
			}
		});
	}
});
//返回order页面
$("#back").on("click",function(){
	var str="login_money="+trxAmount+"&customerNo="+customerNo+"&sessionId="+sessionId+"&tel="+tel+"&orderNo="+orderNo_shop+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
	var publicStr=publicKey(str);
	window.location.href="../views/payment.html?"+publicStr;
});

