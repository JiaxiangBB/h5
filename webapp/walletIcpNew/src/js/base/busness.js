$(document).ready(function(){
	
	function getRootPath(){   
	    var pathName = window.location.pathname.substring(1);   
	    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));  
	    var rootPath = window.location.protocol + '//' + window.location.host+ '/'+ webName + "/";

	  //如果是开发环境，则路径与测试环境不同
	  //return window.location.protocol + '//' + window.location.host + '/'+ webName + "/";
	  //return window.location.protocol + '//' + window.location.host + '/'+ webName + '/' + "micromall" + "/";  
	    return  rootPath;
	}
	
	//返回按钮
	$(".back").off("click").on("click",function(){
		window.history.back(-1);
	});
	
	//立即登录 页面
	$(".imRegistered").off("click").on("click",function(){
		//alert("zhuce ")
		window.location.href="../views/registered.html";
	});
	
	$(".loginFun").off("click").on("click",function(){
		//alert("pp")
		var mobile = $(".phone_number").val();//手机号
		var password = $(".password").val();//密码
		var parms={};
		parms.loginType="2";//登录方式
		parms.userId=mobile;//用户ID
		//parms.password=hex_md5(password);//密码加密
		parms.password=password;//密码加密
		//parms.validateCode = "9789";//图形验证码
		parms.channelType = "005";
		
		//会自动转码，适合表单参数多的时候
		$.ajax({
			url :getRootPath()+"/SystemAction.login.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						$(".login-tip").css("display","none");
						var customerNo=data.data.customerNo;
						var lastMac=data.data.lastMac;
						var sessionId=data.data.sessionId;
						var payPwdFlag=data.data.payPwdFlag;
						var customerNameCN="";
						var mobile=data.data.mobile;
						var lastLogonTime_one=data.data.lastLogonTime.substr(4,2)+"-"+data.data.lastLogonTime.substr(6,2);
						var lastLogonTime_two=data.data.lastLogonTime.substr(8,2)+":"+data.data.lastLogonTime.substr(10,2);
						var lastLogonTime=lastLogonTime_one+" "+lastLogonTime_two;
						if(data.data.customerNameCN.length==11){
							customerNameCN="未实名";
						}else{
							customerNameCN=data.data.customerNameCN;
						}
						var str='{"customerNo":"'+customerNo+'","sessionId":"'+sessionId+'","customerNameCN":"'+customerNameCN+'","mobile":"'+mobile+'","payPwdFlag":"'+payPwdFlag+'","password":"'+password+'","lastLogonTime":"'+lastLogonTime+'"}';
						var publicStr=publicKey(str);
						$scope.toMain(publicStr);
					}else{
						$(".login-tip").css("display","block").text(data.errors.msg);
						//图片验证码
						$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
					}
				}else{
					$(".login-tip").css("display","block").text(data.FAPErrorMessage);
					//图片验证码
					$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
				}
			},
			error:function(a,b,c){
				//alert("错误");
			}			
		});
	});

	//立即注册 页面
	$(".imLogin").off("click").on("click",function(){
		window.location.href="../views/login.html";
	});
	//注册 第一步
	$("#registered_next1").off("click").on("click",function(){
		//alert("login_next1");
		$("#registered_next1").css("display","none");
		$("#registered_next").css("display","block");
	});
	//注册 第二步
	$("#registered_next2").off("click").on("click",function(){
		//alert("login_next1");
		$("#registered_next").css("display","none");
		$(".registered_next2").css("display","block");
	});

	
	
	//找回密码页面
	//输入手机号 第一步
	$(".login_next").off("click").on("click",function(){
		$(".phoneNumber").css("display","none");
		$(".imgCode").css("display","none");
		$("#messages").css("display","block");
		$(".password_next").css("display","block");
		$(".password_error_message").css("display","block");
		$(".password_side_bar p span .b1").removeClass("current");
		$(".password_side_bar p span .b2").addClass("current");
	})
	//验证身份 第二步
	$(".password_next").off("click").on("click",function(){
		$(".password_error_message").css("display","none");
		$("#messages").css("display","none");
		$(".password_next").css("display","none");
		$(".setpassword_form_group").css("display","block");
		$(".password_set").css("display","block");
		$(".password_side_bar p span .b2").removeClass("current");
		$(".password_side_bar p span .b3").addClass("current");
	})
	//重置密码 成功
	$(".password_set").off("click").on("click",function(){
		$(".setpassword_form_group").css("display","none");
		$(".password_set").css("display","none");
		$(".complete").css("display","block");
		$(".complete_login").css("display","block");
		$(".password_side_bar p span .b3").removeClass("current");
		$(".password_side_bar p span .b4").addClass("current");
	})
	
	//商品详情
	$("#shopChat1").off("click").on("click",function(){
		window.location.href="../views/jionChat.html";
	});
	$("#shopChat2").off("click").on("click",function(){
		window.location.href="../views/jionChat2.html";
	});
	$("#shopChat3").off("click").on("click",function(){
		window.location.href="../views/jionChat3.html";
	});
	$("#shopChat4").off("click").on("click",function(){
		window.location.href="../views/jionChat4.html";
	});
	$("#shopChat5").off("click").on("click",function(){
		window.location.href="../views/jionChat5.html";
	});
	$("#shopChat6").off("click").on("click",function(){
		window.location.href="../views/jionChat6.html";
	});
	
	//去购物车结算
	$(".chat_box .shopCat #jionChat").off("click").on("click",function(){
		window.location.href="../views/chatChat.html";
	});
	$(".chat_box .shopCat #jionChat2").off("click").on("click",function(){
		window.location.href="../views/chatChat2.html";
	});
	$(".chat_box .shopCat #jionChat3").off("click").on("click",function(){
		window.location.href="../views/chatChat3.html";
	});
	$(".chat_box .shopCat #jionChat4").off("click").on("click",function(){
		window.location.href="../views/chatChat4.html";
	});
	$(".chat_box .shopCat #jionChat5").off("click").on("click",function(){
		window.location.href="../views/chatChat5.html";
	});
	$(".chat_box .shopCat #jionChat6").off("click").on("click",function(){
		window.location.href="../views/chatChat6.html";
	});
	
	//计入结算中心
	$(".chat_box .setCenter #chatChat").off("click").on("click",function(){
		window.location.href="../views/chatDetails.html";
	});
	$(".chat_box .setCenter #chatChat2").off("click").on("click",function(){
		window.location.href="../views/chatDetails2.html";
	});
	$(".chat_box .setCenter #chatChat3").off("click").on("click",function(){
		window.location.href="../views/chatDetails3.html";
	});
	$(".chat_box .setCenter #chatChat4").off("click").on("click",function(){
		window.location.href="../views/chatDetails4.html";
	});
	$(".chat_box .setCenter #chatChat5").off("click").on("click",function(){
		window.location.href="../views/chatDetails5.html";
	});
	$(".chat_box .setCenter #chatChat6").off("click").on("click",function(){
		window.location.href="../views/chatDetails6.html";
	});
	
	//提交订单
	$(".submitOrders").off("click").on("click",function(){
		alert("订单提交成功");
	});
	
});