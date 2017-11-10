//解析参数
var url = window.location.search;
var str = url.substr(1);
var privateStr="?"+privateKey(str);
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(privateStr)||[,""])[1].replace(/\+/g, '%20'))||null;
};
$(function(){
	//点击完成
	$("#pay_psw").click(function(){
		var payPsw=$("#payPsw").val();
		var confirm_psw=$("#confirm_psw").val();
		//支付密码格式验证
		var rules = /^\d{6}$/;
	    var judge=rules.test(payPsw);
		if(payPsw!==""&&confirm_psw!==""){
			if(judge==true){
				if(payPsw==confirm_psw){
					var login_psw=$("#login_psw").val(),
					    customerNo=getURLParameter("customerNo"),
					    sessionId=getURLParameter("sessionId"),
					    login_money=getURLParameter("login_money"),
					    orderNo=$("#orderNo").val(),
						mallId=$("#mallId").val(),
						notifyUrl=$("#notifyUrl").val();
					var parms={};
					parms.password=hex_md5(login_psw);//密码加密
					/*parms.password=login_psw;*/
					parms.cstNo=customerNo;
					parms.payPwd=payPsw;
					$.ajax({
						url : getRootPath()+"/SystemAction.setPayPwd.do?FAPView=JSON",
						data : parms,
						success : function(data) {
							var data=$.parseJSON(data);
							//console.log(data);
							var str="customerNo="+customerNo+"&payPsw="+payPsw+"&sessionId="+sessionId+"&login_money="+login_money+"&orderNo="+orderNo+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
		 					var publicStr=publicKey(str);
							window.location.href="../views/payment.html?"+publicStr;
						},error : function() {
							//location = "index.html";
						}
					});
				}else{
					$(".login_mask").css("display","block").text("两次输入的支付密码不同");
					setTimeout(function(){
						$(".login_mask").css("display","none");
					},2000);
				}
			}else{
				$(".login_mask").css("display","block").text("密码格式错误");
				setTimeout(function(){
					$(".login_mask").css("display","none");
				},2000);
			}
		}else{
			$(".login_mask").css("display","block").text("密码不可为空");
			setTimeout(function(){
				$(".login_mask").css("display","none");
			},2000);
		}
	})
});