//立即注册页面
function register($scope,$rootScope,$location,$state){
	//向main.html页面传参数        
    $scope.toMain = function (publicStr){
    	$state.go('wrap.main', {publicStr: publicStr});
    }; 
    $(".closs").off("click").on("click",function(){
	   $("#mark_one").css("display","none");
       $("#mark_two").css("display","none");
       $("#mark_search").css("display","none");
	});
	$(".back").off("click").on("click",function(){
		window.location.href="./index.html";
	});
	$(".backIndex").off("click").on("click",function(){
		$(".register_form").css("display","block");
		$(".register_form2").css("display","none");
		$(".pay_form").css("display","none");
		$(".login_form").css("display","none");
		$(".error_message").css("opacity","0");
		$(".backIndex").css("display","none");
	});
	$("#phone_number").blur(function(){	
		var rules_phone = /^1[34578][0-9]{9}$/;
	    var isTel=rules_phone.test($(this).val());
		if(isTel==false){
			$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
			$(".error_message").css("background","#BCD2EE");
			$(".error_message").css("opacity","1").find("b").text("请输入正确的手机号");
		}else{
			var phoneNumber = $("#phone_number").val();//手机号
			var parms = {};
			parms.registerType= 2 ;//注册ID类型
			parms.userId= phoneNumber;//注册ID  邮箱或手机号码
			$.ajax({//校验手机号
				url :getRootPath()+"/SystemAction.validateRegisterId.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							verify();
							message();
						}else{
							$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
							$(".error_message").css("background","#FFC0CB");
							$(".error_message").css("opacity","1").find("b").text(data.errors.msg);
							//图片验证码
							$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
						}
					}else if(data.FAPStatus==2){
						$("#mark_two").css("display","block").find(".text").text("请重新登录");
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_two").css("display","none");
				    		window.location.href="./index.html";
				    	});
					}else{
						if(data.FAPErrorMessage=="手机号码已经被使用"){
							$("#mark_two").css("display","block").find(".text").text("手机号码已经注册，请直接登录");
					    	$(".change").off("click").live("click",function(){
					    		$("#mark_two").css("display","none");
					    		window.location.href="./index.html";
					    	});
						}else{
							$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
							$(".error_message").css("background","#FFC0CB");
							$(".error_message").css("opacity","1").find("b").text(data.FAPErrorMessage);
						}
						//图片验证码
						$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
					}
				},
				error:function(a,b,c){
					//alert("错误");
				}					
			});
			function verify(){
				//点击下一步
				$scope.register_next = function(){
					if($("#img_code").val()==""){
						if($(".agree").attr("checked")){
							$(".backIndex").css("display","block");
							$(".register_form").css("display","none");
							$(".register_form2").css("display","block");
							$(".error_message").css("opacity","0");
						}else{
							$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
							$(".error_message").css("background","#BCD2EE");
							$(".error_message").css("opacity","1").find("b").text("请先阅读全时钱包用户注册手续");
							$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
						}
					}else{
						if($(".agree").attr("checked")){
			    			$(".backIndex").css("display","block");
							$(".register_form").css("display","none");
							$(".register_form2").css("display","block");
							$(".error_message").css("opacity","0");
						}else{
							$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
							$(".error_message").css("background","#BCD2EE");
							$(".error_message").css("opacity","1").find("b").text("请先阅读全时钱包用户注册手续");
							$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
						}
					}
					
				};
			}
		}
	});
	

  	//图片验证码
  	$scope.changeImg = function(){
  		$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
  	};
	//封装手机验证码   
	var sign_phone="";
	function auto(func){
		var signs;
		var parms = {};
		var mobile =  $("#phone_number").val();//手机号
		parms.mobileNo=encryptByDES(mobile);//登录方式
		parms.validateType="1";//用户注册1
	     $.ajax({
	    	 url:getRootPath()+"/PublicAction.sendMobileValidateCode.do?FAPView=JSON", //目标地址
	    	 async:true,
	    	 data : parms,
	    	 success: function (data){
	    		var data=$.parseJSON(data);
	    		console.log(data);
	    		if(data.FAPStatus==0){
					if(data.success==true){
						$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
						$(".error_message").css("background","#BCD2EE");
						$(".error_message").css("opacity","1").find("b").text("验证码已发送，请查收");
						 func(data);
						 signs=true;
						 sign();
					}else{
						$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
						$(".error_message").css("background","#FFC0CB");
						$(".error_message").css("opacity","1").find("b").text(data.errors.msg);
						signs=false;
					}
				}else if(data.FAPStatus==2){
					$("#mark_two").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$("#mark_two").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
					$(".error_message").css("background","#FFC0CB");
					$(".error_message").css("opacity","1").find("b").text(data.FAPErrorMessage);
					signs=false;
				}
	    	 },
	    	 error: function (XMLHttpRequest, textStatus, errorThrown){ 
	    		// location = "index.html";
	    	 }
	     });
	     return signs;
    };
    //发送短信验证码
    function message(){
    	$(".sign_next_again").off("click").bind("click",function(){
    		var mobile =  $("#phone_number").val();//手机号
    		if(mobile==""){
    			$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
    			$(".error_message").css("background","#BCD2EE");
    			$(".error_message").css("opacity","1").find("b").text("请输入正确的手机号");
    		}else{
    			var tab_password=$("#message_code");
    			var tab_img=$("#img_code");
    			var tab_login=$(".error_message").find("b");
    			var mobile =  $("#phone_number").val();//手机号
    			error.telephone(mobile,tab_password,tab_img,tab_login);
    			if(error.telephone(mobile,tab_password,tab_img,tab_login)==true){
    				auto(function(data){
    			    	 sign_phone=data;
    				});
    			}else{
    				$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
					$(".error_message").css("background","#FFC0CB");
					$(".error_message").css("opacity","1").find("b").text("手机号格式错误");
    			}
    		}
    	});
    }
	
	//登录密码检测
	$("#login_pass").focus(function(){
		$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
		$(".error_message").css("background","#BCD2EE");
		$(".error_message").css("opacity","1").find("b").text("请输入正确的登录密码");
	});
	$("#login_pass").blur(function(){
		var password=$("#login_pass").val();
		var tab_img=$("#confirmlogin_pass");
		var tab_login=$(".error_message").find("b");
		error.password(password,tab_img,tab_login);
		if(error.password(password,tab_img,tab_login)==true){
			//设置登录密码  点击下一步
			$scope.login_pass = function(){
				var confirmlogin_pass=$("#confirmlogin_pass").val();
				if(password==confirmlogin_pass){
					$(".register_form2").css("display","none");
					$(".login_form").css("display","none");
				    $(".pay_form").css("display","block");	
				    $(".error_message").css("opacity","0");
				}else{
					$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
					$(".error_message").css("background","#FFC0CB");
					$(".error_message").find("b").text("两次输入的登录密码不一致");
				}
			};
		}else{
			$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
			$(".error_message").css("background","#FFC0CB");
		}
	});
	//支付密码检测
	$("#pay_password").focus(function(){
		$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
		$(".error_message").css("background","#BCD2EE");
		$(".error_message").css("opacity","1").find("b").text("请确保支付密码与登录密码不同");
	});
	$("#pay_password").blur(function(){
		var pay_password=$("#pay_password").val();
		var tab_img=$("#pay_pass2");
		var tab_login=$(".error_message").find("b");
		error.payPassword(pay_password,tab_img,tab_login);
		if(error.payPassword(pay_password,tab_img,tab_login)==true){
			//注册 设置支付密码  提交
			//判断登录密码与支付密码不能相同；		
			$scope.submitRegist = function(){
				var mobile =  $("#phone_number").val();
				var login_pass = hex_md5($("#login_pass").val());//登录密码加密
				/*var pay_pass = hex_md5($("#pay_password").val());*///支付密码加密
				/*var login_pass = $("#login_pass").val();*/	//登录密码
				var pay_pass = $("#pay_password").val();//支付密码
				var pay_pass2 = $("#pay_pass2").val();
				var validMobileCode = $("#message_code").val();//短信验证码
				if(pay_pass==pay_pass2){
					var contactor;
					if($("#img_code").val()==""){
						contactor="";
					}else{
						contactor=$("#img_code").val();
					}
					var parms = {};
					parms.registerType = "2";//注册id类型
					parms.userId = mobile;//注册id
					parms.password = login_pass;//登录密码
					parms.payPwd = encryptByDES(pay_pass); //支付密码
					parms.flag = "0";//身份信息登记标志
					parms.mobileValidateCode = encryptByDES(validMobileCode);//短信验证码
					parms.contactor=contactor;//邀请码
					$.ajax({
						url :getRootPath()+"/SystemAction.userRegister.do?FAPView=JSON",
						type: 'post',
						data : parms,
						success : function(data) {
							var data=$.parseJSON(data);
							console.log(data);
							if(data.FAPStatus==0){
								if(data.success==true){
									$("#mark_two").css("display","block").find(".text").text("注册成功，请登录");
							    	$(".change").off("click").live("click",function(){
							    		$("#mark_two").css("display","none");
							    		window.location.href="./index.html";
							    	});
								}else{
									$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
									$(".error_message").css("background","#FFC0CB");
									$(".error_message").find("b").text(data.errors.msg);
									signs=false;
								}
							}else if(data.FAPStatus==2){
								$("#mark_two").css("display","block").find(".text").text("请重新登录");
						    	$(".change").off("click").live("click",function(){
						    		$("#mark_two").css("display","none");
						    		window.location.href="./index.html";
						    	});
							}else{
								$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
								$(".error_message").css("background","#FFC0CB");
								$(".error_message").find("b").text(data.FAPErrorMessage);
								signs=false;
							}
						},
						error:function(a,b,c){
							//alert("错误");
						}					
					});
				}else{
					$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
					$(".error_message").css("background","#FFC0CB");
					$(".error_message").find("b").text("两次输入的支付密码不一致");
				}	
			};
		}else{
			$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
			$(".error_message").css("background","#FFC0CB");
		}
	});
	
	
	//注册页面 转到立即登录
	$scope.registerLogin = function(){
		$(".register_box h4").text("立即登录");
		$(".backIndex").css("display","block");
		$(".register_form").css("display","none");
		$(".login_form").css("display","block");
		$(".error_message").css("opacity","0");
	};
	
	//注册页面 转到立即登录 转到立即注册
	$scope.loginRegister = function(){
		$(".register_box h4").text("快速注册");
		$(".register_form").css("display","block");
		$(".login_form").css("display","none");
		$(".error_message").css("opacity","0");
	};
	
	//全是钱包用户注册协议
	$scope.registrationAgreement = function(){
		$("#mark_registration").css("display","block");
	};
	$scope.close = function(){
		$("#mark_registration").css("display","none");
	};
	//立即登录
	$("#loginPhone_number").blur(function(){
		if($("#login_password").val()==""){
			$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
			$(".error_message").css("background","#BCD2EE");
			$(".error_message").css("opacity","1").find("b").text("请输入正确的手机号");
		}
		$("#login_password").blur(function(){
			if($("#login_password").val()==""){
				$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
				$(".error_message").css("background","#BCD2EE");
				$(".error_message").css("opacity","1").find("b").text("请输入6-16位字符，支持数字字母等");
			}
			$("#image_code").blur(function(){
				if($("#image_code").val()==""){
					$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
					$(".error_message").css("background","#BCD2EE");
					$(".error_message").css("opacity","1").find("b").text("请输入图形验证码");
				}
				$scope.immediatelyLogin = function(){
					var mobile =  $("#loginPhone_number").val();//手机号
					var password = $("#login_password").val();//密码
					var password_img = $("#image_code").val();//图形验证码
					var parms = {};
					parms.loginType="2";//登录方式
					parms.userId=mobile;//用户ID
					/*parms.password=hex_md5(password);*///密码加密
					parms.password=password;//密码
					parms.validateCode = password_img;//图形验证码
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
									$(".error_message").css("opacity","0");
									var customerNo=data.data.customerNo;
									var lastMac=data.data.lastMac;
									var sessionId=data.data.sessionId;
									var payPwdFlag=data.data.payPwdFlag;
									var customerNameCN="";
									var mobile=data.data.mobile;
									var lastLogonTime_one=data.data.lastLogonTime.substr(4,2)+"-"+data.data.lastLogonTime.substr(6,2);
									var lastLogonTime_two=data.data.lastLogonTime.substr(8,2)+":"+data.data.lastLogonTime.substr(10,2);
									var lastLogonTime=lastLogonTime_one+" "+lastLogonTime_two;
									//console.log(lastLogonTime);
									if(data.data.customerNameCN.length==11){
										customerNameCN="未实名";
									}else{
										customerNameCN=data.data.customerNameCN;
									}
									var str='{"customerNo":"'+customerNo+'","sessionId":"'+sessionId+'","customerNameCN":"'+customerNameCN+'","mobile":"'+mobile+'","payPwdFlag":"'+payPwdFlag+'","password":"'+password+'","lastLogonTime":"'+lastLogonTime+'"}';
									var publicStr=publicKey(str);
									$scope.toMain(publicStr);
								}else{
									$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
									$(".error_message").css("background","#FFC0CB");
									$(".error_message").css("opacity","1").find("b").text(data.errors.msg);
									//图片验证码
									$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
								}
							}else if(data.FAPStatus==2){
								$("#mark_two").css("display","block").find(".text").text("请重新登录");
						    	$(".change").off("click").live("click",function(){
						    		$("#mark_two").css("display","none");
						    		window.location.href="./index.html";
						    	});
							}else{
								$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
								$(".error_message").css("background","#FFC0CB");
								$(".error_message").css("opacity","1").find("b").text(data.FAPErrorMessage);
								//图片验证码
								$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
							}
						},
						error:function(a,b,c){
							//alert("错误");
						}					
					});
				};
		   });
		});
	});
};

angular.module("myapp")
		.controller("register",["$scope","$rootScope","$location","$state","$stateParams",register]);