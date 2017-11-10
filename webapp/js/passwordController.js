function password($scope,$rootScope,$location,$state){
	$(".back").off("click").on("click",function(){
		window.location.href="./index.html";
	});
	$(".backIndex").off("click").on("click",function(){
		$(".password_side_bar .b1").addClass("current").removeClass("dui").text("1");
		$(".password_side_bar .b2").removeClass("dui").removeClass("current").text("2");
		$(".password_side_bar .b3").removeClass("dui").removeClass("current").text("3");
		$(".password_side_bar .b4").removeClass("dui").removeClass("current").text("4");
		$(".backIndex").css("display","none");
		$(".error_message").css("display","none");
		$(".form_group").css("display","block");
		$(".setpassword_form_group").css("display","none");
		$(".complete").css("display","none");
		$(".password_error_message").css("display","none");
		$(".password_form_group").css("display","none");
		$(".password_next").css("display","none");
		$(".password_set").css("display","none");
		$(".complete_login").css("display","none");
		$(".next").css({"display":"block","width":"280px","margin-top":"27px"});
	});
	//下一步1
	$(".enterPhonenumber").off("click").click(function(){ 
	    $scope.mobile = $(".phone_number").val();
	    var rules_phone = /^1[34578][0-9]{9}$/;
	    var isTel=rules_phone.test($scope.mobile);
		if(isTel==true){
			$(".password_form").css({"width":"280px"});
			$(".next").css({"width":"280px"});
			$(".backIndex").css("display","block");
			$(".error_message").css("display","none");
			$(".form_group").css("display","none");
			$(".password_error_message").css("display","block");
			$(".password_form_group").css("display","block");
			$(".password_side_bar .b1").removeClass("current").addClass("dui").text("");
			$(".password_side_bar .b2").addClass("current");
			$(".password_form .next").css("display","none");
			$(".password_next").css({"display":"block","width":"280px","margin-top":"27px"});
		}else{
			$(".error_message").css("display","block").find("b").text("手机号格式错误");
		}
		
			
		//发送短信验证
		var InterValObj; //timer变量，控制时间
		var count = 59; //间隔函数，1秒执行
		var curCount;//当前剩余秒数
		//函数
		function sendMessage(){	
			curCount=parseInt(count);
			//设置button效果，开始计时
		     $(".sign_time").text(curCount);
		     InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
		     //手机验证码 向后台发送处理数据    					     
		};
		
		$(".sign_next_again").off("click").click(function(){//点击事件
		    sendMessage();//函数调用			
			$(this).css("display","none");
			$(".sign_next_time").css("display","block");//倒计时鼠标划过
        	$scope.mobile =  $(".phone_number").val();
        	//console.log($scope.mobile);
			var parms = {};
			parms.mobileNo= encryptByDES($scope.mobile);//登录方式
			parms.validateType=2;//找回登录密码2 
			$.ajax({
				url :getRootPath()+"/PublicAction.sendMobileValidateCode.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
//					console.log("短信验证码data");
//					console.log(data);
				},
				error:function(a,b,c){	
					//alert("错误");
				}	
			});
		});
		//timer处理函数
		function SetRemainTime() {
	        if(curCount == 0){                
	            window.clearInterval(InterValObj);//停止计时器
	            count = 59; //间隔函数，1秒执行
		            $(".sign_next_again").css("display","block").text("重新获取");
	            $(".sign_next_time").css("display","none"); 
	            
	        }else {
	            curCount--;
	            $(".sign_time").text(curCount);
	        }
	    };
	    
	    //点击下一步2
		$(".authenticate").off("click").click(function(){
			var message_code = $(".message_code").val();//图形验证码非空验证
			if(message_code == ""){
				$(".password_error_message .p1").css("display","none");
				$(".password_error_message").find(".p2").css("display","block").text("短信验证码不能为空");
			}else{
				$(".password_error_message").css("display","none");
				$(".password_form_group").css("display","none");
				$(".password_next").css("display","none");
				$(".setpassword_form_group").css("display","block");
				$(".password_set").css("display","block");
				$(".password_side_bar .b2").removeClass("current").addClass("dui").text("");
				$(".password_side_bar .b3").addClass("current");
				
				//手机验证码校验 屏蔽掉  集团后台校验
//				var message_code = $(".message_code").val();
//				if(true){//手机验证码 校验
//					var parms = {};
//					parms.mobileValidateCode = message_code;//手机验证码
//					$.ajax({
//						url :getRootPath()+"/PublicAction.validateMobileCode.do?FAPView=JSON",
//						type: 'post',
//						data : parms,
//						success : function(data) {
//							var data=$.parseJSON(data);
//							console.log("手机验证码 校验");
//							console.log(data);
//						},
//						error:function(a,b,c){
//							//alert("错误");
//						}					
//					});
//				}else{
//				}
				
				$(".forgetLoginPassword").off("click").click(function(){//点击 下一步3 密码接口
					var logo_passm = $(".logo_passm").val();//设置登录密码
					var logo_passm2= $(".logo_passm2").val();//确认登录密码
					if(logo_passm=="" && logo_passm2==""){
						$(".error_message").css("display","block").find("b").text("登录密码不能为空");
					}else if(logo_passm == logo_passm2){
						var mobile =  $(".phone_number").val();//用户名 手机号
						var img_codeText = $("#img_codeText").val();//图形验证码
						var message_code = $(".message_code").val();//短信验证码		
						var registerType = 2;
						var login_pass = $(".logo_passm").val();//登录密码
						var login_pass2 = $(".logo_passm2").val();	//确认密码
						if(true){
							var parms = {};
							parms.userName = mobile;//注册id
							parms.findWay = 0;//0:手机找回  1：邮箱找寻
							parms.verifyCode = img_codeText;//图片验证码
							parms.password = hex_md5(login_pass);//新密码
							parms.confirmPassword = hex_md5(login_pass2);//确认密码
							parms.smsCode = encryptByDES(message_code);//手机验证码
							$.ajax({
								url :getRootPath()+"/SecurityCenterAction.findLoginPwd.do?FAPView=JSON",
								type: 'post',
								data : parms,
								success : function(data) {
									var data=$.parseJSON(data);
//									console.log(data);
									if(data.FAPStatus==0){
										if(data.success==true){
											var lastMac=data.data.lastMac;
											var sessionId=data.data.sessionId;
											$(".setpassword_form_group").css("display","none");
											$(".password_set").css("display","none");
											$(".complete").css("display","block");
											$(".complete_login").css("display","block");
											$(".password_side_bar .b3").removeClass("current").addClass("dui").text("");
											$(".password_side_bar .b4").addClass("current");
											$(".back a").css("display","none");
											//完成之后 显示完成按钮
											$(".setpassword_form_group").css("display","none");
											$(".complete").css("display","block");
											$(".error_message").css("display","none");
											//立即登录跳转链接
											$scope.loginPass = function(){
												window.location.href="./index.html";
											};
										}else{
											$(".error_message").css("display","block").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
											$(".error_message").css("background","#FFC0CB");
											$(".error_message").find("b").text(data.errors.msg);
										}
									}else if(data.FAPStatus==2){
										$("#mark_two").css("display","block").find(".text").text("请重新登录");
								    	$(".change").off("click").live("click",function(){
								    		$("#mark_two").css("display","none");
								    		window.location.href="./index.html";
								    	});
									}else{
										if(data.FAPErrorMessage){
											$(".error_message").find("b").text(data.FAPErrorMessage);
										}else{
											$(".error_message").find("b").text(data.FAPErrorCode);
										}
										$(".error_message").css("display","block").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
										$(".error_message").css("background","#FFC0CB");
									}
								},
								error:function(a,b,c){
									//alert("错误");
								}					
							});
						}else{
						
						}
					}else{
						$(".error_message").css("display","block").find("b").text("两次输入的密码不一致");
					}
				});
			}
		});
		
	});
	
	//图片验证码
  	$scope.changeImg = function(){
  		$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
  	};
};

angular.module("myapp")
		.controller("password",["$scope","$rootScope","$location","$state","$stateParams",password]);