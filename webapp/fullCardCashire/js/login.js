//解析参数，手机号和密码
var url = window.location.search;
var str = url.substr(1);
var privateStr="?"+privateKey(str);
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(privateStr)||[,""])[1].replace(/\+/g, '%20'))||null;
};
var tel=getURLParameter("tel");
var psw=getURLParameter("psw");
var login_money=getURLParameter("login_money");
var orderNo=getURLParameter("orderNo");
var mallId=getURLParameter("mallId");
var notifyUrl=getURLParameter("notifyUrl");
/*$("#sign_tel").val(tel);
$("#sign_psw").val(psw);
$("#login_money").val(login_money);
$("#login_tel").val(tel);
$("#login_psw").val(psw);
$("#orderNo").val(orderNo);
$("#mallId").val(mallId);
$("#notifyUrl").val(notifyUrl);*/

//检测手机号
function isTel() {
	var tel = $('#login_tel').val();
    var rules = /^1[34578][0-9]{9}$/;
    return rules.test(tel);
};
function isTel_two() {
	var tel = $('#sign_tel').val();
    var rules = /^1[34578][0-9]{9}$/;
    return rules.test(tel);
};
//检测密码
function isPsw() {
	var psw = $('#login_psw').val();
    var rules = /^[^\s]{6,16}$/;
    return rules.test(psw);
};
function isPsw_two() {
	var psw = $('#sign_psw').val();
    var rules = /^[^\s]{6,16}$/;
    return rules.test(psw);
};
/*//图片登录
function changeImg(){
	$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
}
*/

//点击登录
$(function(){
	$("#login").on("click",function(){
		var tel = $('#login_tel').val(),
			psw = $("#login_psw").val(),
			login_money=$("#login_money").val(),
			orderNo=$("#orderNo").val(),
			mallId=$("#mallId").val(),
			notifyUrl=$("#notifyUrl").val();
		if(tel=="" || psw=="" || login_money=="" || orderNo=="" || mallId=="" || notifyUrl==""){
			$(".login_mask").css("display","block").text("商品信息不全");
			setTimeout(function(){
				$(".login_mask").css("display","none");
			},2000);
		}else{
			if(isTel()==true){
				if(isPsw()==true){
					var parms = {};
					parms.loginType="2";
					/*parms.userId="18311189970";*/
					parms.userId=tel;
					parms.password=hex_md5(psw);//密码加密
					/*parms.password=psw;*/
					parms.passwordType="1";
					//会自动转码，适合表单参数多的时候
					$.ajax({
						url : getRootPath()+"/PublicPayAction.sdkLoginFirst.do?FAPView=JSON",
						data : parms,
						success : function(data) {
							var data=$.parseJSON(data);
							console.log(data)
							if(data.FAPErrorCode=="PPERLG01"){
								$(".login_mask").css("display","block").text(data.FAPErrorMessage);
								setTimeout(function(){
		 	    					$(".login_mask").css("display","none");
		 	    				},2000);
								var str="phone="+tel+"&login_money="+login_money+"&orderNo="+orderNo+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
								var publicStr=publicKey(str);
								window.location.href="../views/sign.html?"+publicStr;
							}else{
								if(data.FAPStatus==0){
									if(data.success==true){
										var customerNo=data.data.customerNo;
										var lastMac=data.data.lastMac;
										var sessionId=data.data.sessionId;
									 	var payPwdFlag=data.data.payPwdFlag;
										var date = new Date();
										var year=date.getFullYear(); 
										var month=date.getMonth()+1;
										var days=date.getDate();
										var hours=date.getHours();
										var minutes=date.getMinutes();
										var second=date.getSeconds();

										if(month<10){
											month="0"+month;
										}
										if(days<10){
											days="0"+days;
										}

										var orderNo=year+month+days+hours+minutes+second;
										if(payPwdFlag=="1"){
											$(".login_mask").css("display","block").text("登录成功");
											setTimeout(function(){
					 	    					$(".login_mask").css("display","none");
					 	    				},2000);
											var str="customerNameCN="+data.data.customerNameCN+"&customerNo="+customerNo+"&sessionId="+sessionId+"&login_money="+login_money+"&tel="+tel+"&orderNo="+orderNo+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
											var publicStr=publicKey(str);
											window.location.href="../views/payment.html?"+publicStr;
										}else{
											$(".login_mask").css("display","block").text("请先设置支付密码");
											setTimeout(function(){
					 	    					$(".login_mask").css("display","none");
					 	    				},2000);
											var str="customerNo="+customerNo+"&sessionId="+sessionId+"&login_money="+login_money+"&tel="+tel+"&orderNo="+orderNo+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
											var publicStr=publicKey(str);
											window.location.href="../views/password_Retrieve_1.html?"+publicStr;
										}		
									}else{
										$(".login_mask").css("display","block").text(data.errors.msg);
						    			 setTimeout(function(){
											$(".login_mask").css("display","none");
										},2000);
									}
								}else{
									if(data.FAPErrorMessage){
										$(".login_mask").css("display","block").text(data.FAPErrorMessage);
				 		    			 setTimeout(function(){
				 	    					$(".login_mask").css("display","none");
				 	    				},2000);
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
							}
						},
						error:function(a,b,c){
							console.log("失败")
						}
					});
				}else{
					$(".login_mask").css("display","block").text("密码格式错误");
					setTimeout(function(){
						$(".login_mask").css("display","none");
					},2000);
				}
			}else{
				$(".login_mask").css("display","block").text("手机号格式错误");
				setTimeout(function(){
					$(".login_mask").css("display","none");
				},2000);
			}
		}
		
	});
});
//注册
$(function(){
	var phone=getURLParameter("phone");
	$("#sign_tel").val(phone);
	//注册点击下一步
	$("#sign_next").removeAttr("disabled");
	$("#sign_next").on("click",function(){
		$(this).attr('disabled',"true");
		var tel = $('#sign_tel').val(),
		    psw = $("#sign_psw").val();
		if(isTel_two()==true){
			if(isPsw_two()==true){
				var str="tel="+tel+"&psw="+psw+"&login_money="+login_money+"&orderNo="+orderNo+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
				var publicStr=publicKey(str);
				location.href="../views/sign_next.html?"+publicStr;
			}else{
				$(".next_mask").css("display","block").text("密码格式错误");
				setTimeout(function(){
					$(".next_mask").css("display","none");
				},2000);
			}
			
		}else{
			$(".next_mask").css("display","block").text("手机号格式错误");
			setTimeout(function(){
				$(".next_mask").css("display","none");
			},2000);
		}
	});
	//点击返回注册第一页
	$("#sign_back").on("click",function(){
		var str="tel="+tel+"&psw="+psw+"&login_money="+login_money+"&orderNo="+orderNo+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
		var publicStr=publicKey(str);
		location.href=encodeURI("../views/login.html?"+publicStr);
	});
});