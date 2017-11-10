
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
var customerNameCN=getURLParameter("customerNameCN");
//$("#custNm").val(customerNameCN);
//检测手机号
function isTelephone() {
	var tel = $('#mobile').val();
    var rules = /^1[34578][0-9]{9}$/;
    return rules.test(tel);
};
//当前日期
var now = new Date();
var year = now.getFullYear();
var month =(now.getMonth() + 1).toString();
var day = (now.getDate()).toString();
var hour = now.getHours();
var minute = now.getMinutes();
var second = now.getSeconds();
if (month.length == 1) {
    month = "0" + month;
}
if (day.length == 1) {
    day = "0" + day;
}
var dateTime = year + month +  day+hour+minute+second;



//定义全局变量
var expiryDate="";
var cvv="";
//输入卡号之后进行判断储蓄卡还是信用卡

$("#subOne").on("click",function(){ 
	//console.log(1);
	var cardNo = $("#cardNo").val();
	var params={};
	params.cardNo=encryptByDES(cardNo);
	//console.log(cardNo)
	$(this).attr('disabled',"true");
	$.ajax({
		url :getRootPath()+"/AccountAction.getCardInf.do?FAPView=JSON",
		data : params,
		success : function(data) {
			var data=$.parseJSON(data);
			//console.log(data);
			if(data.FAPStatus=="0"){
				if(data.success==true){
					$("#subOne").removeAttr("disabled");
					var BANKNAME = data.data.bankName;//银行名称
					var img="";
					img=bankCard(BANKNAME,img);
					var bankcardNo = $("#cardNo").val()//卡号
					var interceptBank = bankcardNo.substring(6,bankcardNo.length-4);//截取卡号中间9位
					var card = bankcardNo.substr(0,6)+interceptBank.replace(interceptBank,"*********")+bankcardNo.substr(bankcardNo.length-4,4);
					$(".message").find("img").attr("src",img);
					$(".message").find(".name").text("中国"+BANKNAME);
					$(".message").find(".card").text(card);
					$(".add_two").css("display","block");
					$(".add_one").css("display","none");
					$(".message").css("opacity","1");
					if(data.data.cardtype=="0"){
						expiryDate="";
						cvv="";
						$("#subOne").css("display","none");
						$("#subTwo").css("display","block");
						$("#subTwo").on("click",function(){
							$(".login_sign button").attr('disabled',"true");
							//console.log(1);
							submit();
						});
					}else{
						$("#subOne").css("display","none");
						$("#submitOne").css("display","block");
						$("#submitOne").on("click",function(){
							if(isTelephone()==true){
								$(".add_two").css("display","none");
								$(".add_card").css("display","block");
								$("#submitOne").css("display","none");
								$("#submitTwo").css("display","block");
								$("#submitTwo").on("click",function(){
									expiryDate=$("#haveDate").val();
									cvv=$("#cvv").val();
									var reg=/^\d{2}\/\d{2}$/;
									var isDate = reg.test(expiryDate);
									$(".login_sign button").attr('disabled',"true");
									if(isDate==true){
										submit();
									}else{
										$(".login_mask").css("display","block").text("有效期格式错误");
										 setTimeout(function(){
											$(".login_mask").css("display","none");
										},2000);
									}
								});
							}else{
								$(".login_mask").css("display","block").text("手机号格式错误");
								 setTimeout(function(){
									$(".login_mask").css("display","none");
								},2000);
							}
						});
					}
				}else{
					$(".login_mask").css("display","block").text(data.errors.msg);
	    			 setTimeout(function(){
						$(".login_mask").css("display","none");
						$("#subOne").removeAttr("disabled");
					},2000);
				}
			}else{
				if(data.FAPErrorMessage){
					if(data.FAPErrorMessage.replace(/\s+/g,'').substring(0,2)=="no"){
						$(".login_mask").css("display","block").text("请重新登录");
					}else{
						$(".login_mask").css("display","block").text(data.FAPErrorMessage);
					}
				}else{
					if(data.errorCode){
						$(".login_mask").css("display","block").text(data.errorCode);
					}else{
						$(".login_mask").css("display","block").text(data.FAPErrorCode);
					}
				}
				setTimeout(function(){
					$(".login_mask").css("display","none");
					$("#subOne").removeAttr("disabled");
				},2000);
			}
		},
		error : function() {
			//location = "index.html";
		}
	});
}); 

//点击绑定银行卡

$(".bank_list input").focus(function(){
	$(".login_sign button").removeAttr("disabled");
});

function submit(){
	var encryption="accountNo="+encryptByDES($("#cardNo").val())+"&certno="+encryptByDES($("#certno").val())+"&channelType=004&ctftype=1&custNm="+ encodeURI($("#custNm").val())+"&customerNo="+customerNo+"&cvv="+encryptByDES(cvv)+"&expiryDate="+expiryDate+"&isFlag=0&mobile="+encryptByDES($("#mobile").val())+"&orderSerialNo="+orderSerialNo+"&payType=26&settFlg=0&trcNo="+dateTime;
	var parms={};
	//console.log(encryption);
	parms.customerNo = customerNo;
	parms.sessionId = sessionId;
	parms.orderSerialNo = orderSerialNo;
	/*parms.tel = tel;
	parms.trxAmount = trxAmount;*/
	parms.certno = encryptByDES($("#certno").val());//身份证号
	parms.custNm = encodeURI($("#custNm").val());
	parms.accountNo = encryptByDES($("#cardNo").val());//银行卡号
	parms.mobile = encryptByDES($("#mobile").val());//手机号
	parms.ctftype = "1";
	/*parms.amount = "";*/
	parms.payType = "26";
	/*parms.payPwd = "";*/
	parms.channelType = "004";
	parms.trcNo = dateTime;
	parms.isFlag = "0";
	parms.settFlg = "0";
	parms.expiryDate = expiryDate;
	parms.cvv = encryptByDES(cvv);
	parms.signKey=publicKeyRSA(md5(encryption));
	$.ajax({
		url :getRootPath()+"/PublicPayAction.bankCardQuickPayRequest.do?FAPView=JSON",
		data : parms,
		success : function(data) {
			var data=$.parseJSON(data);
			//console.log(data);
			if(data.FAPStatus=="0"){
				if(data.success==true){
					if(data.data.authenticateStatus=="0"){
						console.log(data);
						var orderSerialNo=data.data.orderNo;
						var str="customerNo="+customerNo+"&sessionId="+sessionId+"&trxAmount="+trxAmount+"&tel="+tel+"&orderSerialNo="+orderSerialNo+"&cardNo="+$("#cardNo").val()+"&orderNo_shop="+orderNo_shop+"&mallId="+mallId+"&accountNo="+$("#cardNo").val()+"&phoneNum="+$("#mobile").val()+"&notifyUrl="+notifyUrl;
	 					var publicStr=publicKey(str);
						location.href="../views/add_bank3.html?"+publicStr;
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
				
				if(data.errorCode){
					$(".login_mask").css("display","block").text(data.errorCode);
	    			 setTimeout(function(){
						$(".login_mask").css("display","none");
					},2000);
				}else{
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
				}
			}	
		},
		error : function() {
			//location = "index.html";
		}
	});
}

/*//短信验证支付
$("#pay").on("click",function(){
	var message=$("#message").val();
	if(message==""){
		$(".login_mask").css("display","block").text("验证码不可为空");
		 setTimeout(function(){
			$(".login_mask").css("display","none");
		},2000);
	}else{
		var params={};
		params.sessionId = sessionId;
		params.customerNo = customerNo;
		params.orderSerialNo = orderSerialNo;
		params.payValidateCode = message;
		params.accountNo = cardNo;
		$.ajax({
			url :getRootPath()+"PublicPayAction.bankCardQuickPayConfirm.do?FAPView=JSON",
			data : params,      
			success : function(data) {
				var data=$.parseJSON(data);
				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						var orderNo=data.data.orderNo;
						location.href=encodeURI("../views/back.html?trxAmount="+trxAmount+"&orderSerialNo="+orderNo+"&tel="+tel);
					}else{
						$(".login_mask").css("display","block").text(data.errors.msg);
		    			 setTimeout(function(){
							$(".login_mask").css("display","none");
						},2000);
					}
					
				}else{
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
				}
				
			},
			error : function() {
				location = "index.html";
			}
		})
	}
})*/

//返回选择支付方式页面
$("#back").on("click",function(){
	if($(".add_card").css("display")=="block"){
		$(".add_card").css("display","none");
		$(".add_one").css("display","none");
		$(".add_two").css("display","block");
		$(".sub").css("display","none");
		$("#submitOne").css("display","block");
		$("#submitTwo").css("display","none");
	}else if($(".add_two").css("display")=="block"){
		$(".add_two").css("display","none");
		$(".add_card").css("display","none");
		$(".add_one").css("display","block");
		$(".next").css("display","none");
		$(".message").css("opacity","0");
		$("#subOne").css("display","block");
		$("#subTwo").css("display","none");
	}else{
		var str="customerNameCN="+customerNameCN+"&login_money="+trxAmount+"&customerNo="+customerNo+"&sessionId="+sessionId+"&tel="+tel+"&orderNo="+orderNo_shop+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
		var publicStr=publicKey(str);
		window.location.href="../views/payment.html?"+publicStr;
	}
});

