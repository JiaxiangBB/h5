
/*--------------------------------------安全管理------------------------------------------------*/
function safety($scope,$rootScope,$location,$state,$stateParams){
	//获取wrap页面的参数         
	//解析url参数     wrap页面    publicStr
	var obj="";
	var str = $stateParams.publicStr;
	if(str==""){
		
	}else{
		var privateStr=privateKey(str);
		obj=angular.fromJson(privateStr);
	}
	
   $scope.customerNo = obj.customerNo;
   $scope.sessionId = obj.sessionId; 
   $scope.mobile = obj.mobile;
   $scope.customerNameCN = obj.customerNameCN;
   $scope.payPwdFlag = obj.payPwdFlag;//是否设置支付密码
   $scope.password = obj.password;//登录密码
   $scope.lastLogonTime = obj.lastLogonTime;//最后一次登录时间
   //解析url参数    二级页面    moneyStr
   var mstr = $stateParams.moneyStr;
   var mprivateStr=privateKey(mstr);
   var mobj=angular.fromJson(mprivateStr);
   $scope.balance_wrap = mobj.balance_wrap;//转账页面显示 账户余额
   $scope.accountBalance = mobj.accountBalance;
   $scope.quanShiCard=mobj.quanShiCard;
   
   //定义全局变量
   var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
	var publicStr=publicKey(str);
	var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}'
	var moneyStr=publicKey(mstr);
	
	//点击返回按钮
	$(".backToSafety").off("click").live("click",function(){
		$(".safety_box").css("display","block");
		$(".change_password_form").css("display","none");
		$(".changePayPswd_form").css("display","none");
		$(".register_box h4").text("安全管理");
		$(".self_back a").attr("data-type","true");
		$(".toMain").show().siblings().hide();
	})
	/*//点击返回按钮
	$(".toMain").off("click").live("click",function(){
		alert(11)
		$scope.toMain(publicStr);
	});*/

	//点击弹框关闭按钮
	 $scope.close=function(){
		$("#mark_one").css("display","none");
	 }
	
	//初始化显示信息
	$scope.message=function(){
		//实名认证判断
		if($scope.customerNameCN=="未实名"){
			$(".Noreal_name").css("display","inline-block");
			$(".real_name").css("display","inline-block");
			$(".real_name_message").css("display","none");
			$(".immediately_link").css("display","none");
			$(".status1").css("display","inline-block");
		}else{
			$(".Noreal_name").css("display","none");
			$(".real_name").css("display","none");
			$(".real_name_message").css("display","inline-block");
			$(".immediately_link").css("display","inline-block");
			$(".status1").css("display","none");
			if($scope.customerNameCN.length==2){
				$(".real_name_message").text($scope.customerNameCN.substr(0,1)+"*")
			}else{
				$(".real_name_message").text($scope.customerNameCN.substr(0,1)+"*"+$scope.customerNameCN.substr(2))
			}
		}
		//支付密码判断
		if($scope.payPwdFlag=="1"){
			//支付密码已设置
			$(".set_paypassword").css("display","none");
			$(".status2").css("display","none");
			$(".change_paypassword").css("display","inline-block");
			$(".forget_payPassword").css("display","inline-block");
			$(".payPassword").text("******");
		}else{
			$(".set_paypassword").css("display","inline-block");
			$(".set_paypassword").css("display","inline-block");
			$(".change_paypassword").css("display","none");
			$(".forget_payPassword").css("display","none");
			$(".payPassword").text("未设置");
		}
	}
	//修改支付密码
	$scope.change_paypassword=function(){
		$(".safety_box").css("display","none");
		$(".changePayPswd_form").css("display","block");
		$(".self_back").css("opacity","1");
		$(".register_box h4").text("修改支付密码");
		$(".backToSafety").show().siblings().hide();
	};
	//修改登录密码
	$scope.change_password=function(){
		$(".self_back").css("opacity","1");
		$(".safety_box").css("display","none")
		$(".change_password_form").css("display","block")
		$(".register_box h4").text("修改登录密码");
		$(".backToSafety").show().siblings().hide();
	}
	//忘记支付密码调用
	 $scope.forget_payPassword = function(){
		 $scope.toresetPsw(publicStr,moneyStr);
	 }
	//设置支付密码调用
	 $scope.set_paypassword=function(){
	    $scope.topayPassword(publicStr,moneyStr);
	 } 
	//修改登录密码提交
	 $("#login_pass").focus(function(){
		$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
		$(".error_message").css("background","#BCD2EE");
		$(".error_message").css("opacity","1").find("b").text("请输入正确的登录密码")
	})
	$("#login_pass").blur(function(){
		var password=$("#login_pass").val();
		var tab_img=$("#confirmlogin_pass");
		var tab_login=$(".error_message").find("b");
		error.password(password,tab_img,tab_login);
		if(error.password(password,tab_img,tab_login)==true){
			if($("#newPswd").val()==""){
				$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
				$(".error_message").css("background","#BCD2EE");
				$(".error_message").css("opacity","1").find("b").text("请输入正确的登录密码")
			}
			$("#newPswd").blur(function(){
				var password=$("#newPswd").val();
				var tab_img=$("#confirmlogin_pass");
				var tab_login=$(".error_message").find("b");
				error.password(password,tab_img,tab_login);
				if(error.password(password,tab_img,tab_login)==true){
					$scope.changgeLoginPswd = function(){
						  var oldPassword = $(".oldPassword").val();//原密码
						  var newPswd = $(".newPswd").val();//新密码
						  var confirmPassword = $(".confirmPassword").val();//确认新密码
						var parms = {};
						parms.customerNo = $scope.customerNo;//客户号
						parms.sessionId = $scope.sessionId;//令牌号
						parms.oldPassword = hex_md5(oldPassword);//原密码
						parms.newPassword = hex_md5(newPswd);//新密码
						parms.confirmPassword = hex_md5(confirmPassword);//确认新密码
						$.ajax({
							url :getRootPath()+"/SecurityCenterAction.modifyLoginPwd.do?FAPView=JSON",
							data : parms,
							success : function(data) {	
								var data=$.parseJSON(data);
								//console.log(data);
								if(data.FAPStatus==0){
									if(data.success==true){
										$("#mark_one").css("display","block").find(".text").text("登录密码修改成功，请重新登录");
										$("#sure").off("click").on("click",function(){
											window.location.href="./index.html";
										})
									}else{
										$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
										$(".error_message").css("background","#FFC0CB");
										$(".error_message").css("opacity","1").find("b").text(data.errors.msg);
									}
								}else if(data.FAPStatus==2){
									$("#mark_one").css("display","block").find(".text").text("请重新登录");
									$(".change").off("click").live("click",function(){
							    		$("#mark_one").css("display","none");
							    		window.location.href="./index.html";
							    	})
								}else{
									$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
									$(".error_message").css("background","#FFC0CB");
									$(".error_message").css("opacity","1").find("b").text(data.FAPErrorMessage);
								}
							},
							error:function(a,b,c){
								//			alert("错误");
							}					
						});
						
					  }
				}else{
					$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
					$(".error_message").css("background","#FFC0CB");
				}
			})
		}else{
			$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
			$(".error_message").css("background","#FFC0CB");
		}
	})
  
	//修改支付密码 
	$("#pay_password").focus(function(){
		$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
		$(".error_message").css("background","#BCD2EE");
		$(".error_message").css("opacity","1").find("b").text("请确保支付密码与登录密码不同")
	})
	$("#pay_password").blur(function(){
		var pay_password=$("#pay_password").val();
		var tab_img=$("#pay_pass2");
		var tab_login=$(".error_message").find("b");
		error.payPassword(pay_password,tab_img,tab_login);
		if(error.payPassword(pay_password,tab_img,tab_login)==true){
			if($("#newpayPswd").val()==""){
				$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
				$(".error_message").css("background","#BCD2EE");
				$(".error_message").css("opacity","1").find("b").text("请确保两次输入支付密码相同");
			}
			$("#newpayPswd").blur(function(){
				var pay_password=$("#newpayPswd").val();
				var tab_img=$("#pay_pass2");
				var tab_login=$(".error_message").find("b");
				error.payPassword(pay_password,tab_img,tab_login);
				if(error.payPassword(pay_password,tab_img,tab_login)==true){
					 //修改支付密码 提交 接口
					  $scope.changePayPassword = function(){
						  var currentPayPswd = $(".currentPayPswd").val();//原密码
						  var newPayPswd = $(".newPayPswd").val();//新密码
						  var conNewPayPswd = $(".conNewPayPswd").val();//确认新密码
							var parms = {};
							parms.customerNo = $scope.customerNo;//客户号
							parms.sessionId = $scope.sessionId;//令牌号
							parms.oldPassword = encryptByDES(currentPayPswd);//原密码
							parms.newPassword = encryptByDES(newPayPswd);//新密码
							parms.confirmPassword = encryptByDES(conNewPayPswd);//确认新密码
							$.ajax({
								url :getRootPath()+"/SecurityCenterAction.modifyPayPwd.do?FAPView=JSON",
								data : parms,
								success : function(data) {	
									var data=$.parseJSON(data);
									//console.log(data);
									if(data.FAPStatus==0){
										if(data.success==true){
											$("#mark_one").css("display","block").find(".text").text("支付密码修改成功");
											$("#sure").off("click").on("click",function(){
												$(".changePayPswd_form").css("display","none");
												$(".safety_box").css("display","block");
												$(".currentPayPswd").val("");
												$(".newPayPswd").val("");
												$(".conNewPayPswd").val("");
												$(".error_message").css("opacity","0")
											})
										}else{
											$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
											$(".error_message").css("background","#FFC0CB");
											$(".error_message").css("opacity","1").find("b").text(data.errors.msg);
										}
									}else if(data.FAPStatus==2){
										$("#mark_one").css("display","block").find(".text").text("请重新登录");
										$(".change").off("click").live("click",function(){
								    		$("#mark_one").css("display","none");
								    		window.location.href="./index.html";
								    	})
									}else{
										$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
										$(".error_message").css("background","#FFC0CB");
										$(".error_message").css("opacity","1").find("b").text(data.FAPErrorMessage);
									}
								},
								error:function(a,b,c){
						//					alert("错误");
								}					
							});
					  }
				}else{
					$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
					$(".error_message").css("background","#FFC0CB");
				}
			})
		}else{
			$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
			$(".error_message").css("background","#FFC0CB");
		}
	}) 
};
angular.module("myapp")
       .controller("safety",["$scope","$rootScope","$location","$state","$stateParams",safety]);