/*--------------------------------------忘记支付密码------------------------------------------------*/
function resetPsw($scope,$rootScope,$location,$state,$stateParams){
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
   var mobile = obj.mobile;
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
	var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}';
	var moneyStr=publicKey(mstr);
	//点击返回按钮
	/*$(".approve_back").off("click").live("click",function(){
		$scope.toMain(publicStr);
		$(".toMain").show().siblings().hide();
	});*/
	$scope.mobile=$scope.mobile.substr(0,3)+"****"+$scope.mobile.substr(7,4);

	 //重置密码 发送手机验证码
    $scope.sendPhoneCode = function(){
		if(true){
			var parms = {};
			parms.mobileNo=encryptByDES(mobile);//手机号
			$.ajax({
				url :getRootPath()+"/PublicAction.sendSmsCode.do?FAPView=JSON",
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							sign();
						}else{
							$("#mark_one").css("display","block").find(".text").text(data.errors.msg);
						}
					}else if(data.FAPStatus==2){
						$("#mark_one").css("display","block").find(".text").text("请重新登录");
						$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    		window.location.href="./index.html";
				    	})
					}else{
						$("#mark_one").css("display","block").find(".text").text(data.FAPErrorMessage);
					}
				},
				error:function(a,b,c){
//					alert("错误");
				}
			});
		}
	}
    //重置支付密码点击下一步
    $scope.resetpay_submit=function(){
    	curCount=0;
	    var message_code = $(".resetpay_form_group .message_code").val();//手机验证码
		if(message_code!==""){
			var parms = {};
			parms.mobileValidateCode = message_code;//手机验证码
			$(".reset_pay_password").css("display","none");
			$(".pay_password_form").css("display","block");
			/*$.ajax({
				url :getRootPath()+"/PublicAction.validateMobileCode.do?FAPView=JSON",
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							$(".reset_pay_password").css("display","none");
							$(".pay_password_form").css("display","block");
						}else{
							$(".reset_pay_error_message").css("display","none");
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
						$(".reset_pay_error_message").css("display","none");
						$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
						$(".error_message").css("background","#FFC0CB");
						$(".error_message").css("opacity","1").find("b").text(data.FAPErrorMessage);
					}
					
				},
				error:function(a,b,c){
//					alert("错误");
				}					
			});*/
		}else{
			$(".reset_pay_error_message").css("display","none");
			$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
			$(".error_message").css("background","#FFC0CB");
			$(".error_message").css("opacity","1").find("b").text("请输入短信验证码");
		}
    };
    
  //设置支付密码 提交
	$("#newPassword").focus(function(){
		$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
		$(".error_message").css("background","#BCD2EE");
		$(".error_message").css("opacity","1").find("b").text("请确保支付密码与登录密码不同")
	})
	$("#newPassword").blur(function(){
		var pay_password=$("#newPassword").val();
		var tab_img=$("#pay_pass2");
		var tab_login=$(".error_message").find("b");
		error.payPassword(pay_password,tab_img,tab_login);
		if(error.payPassword(pay_password,tab_img,tab_login)==true){
			if($("#confirmNewPassword").val()==""){
				$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
				$(".error_message").css("background","#BCD2EE");
				$(".error_message").css("opacity","1").find("b").text("请确保两次输入支付密码相同");
			}
			 $scope.reset_paypassword=function(){
				var password=$("#newPassword").val();
		    	var confirmPassword=$("#confirmNewPassword").val();
		    	var message_code = $(".resetpay_form_group .message_code").val();//手机验证码
				if(password==confirmPassword){
					var parms={};
			    	parms.customerNo = $scope.customerNo;//客户号
					parms.sessionId = $scope.sessionId;//令牌号
					parms.userName = encryptByDES(mobile);//手机号
					parms.findWay = 0;//手机找回
					parms.password = encryptByDES(password);//新密码
					parms.confirmPassword = encryptByDES(confirmPassword);//确认密码
					parms.smsCode=encryptByDES(message_code);//手机验证码
					$.ajax({
						url :getRootPath()+"/SecurityCenterAction.findPayPwd.do?FAPView=JSON",
						data : parms,
						success : function(data) {
							var data=$.parseJSON(data);
							//console.log(data);
							if(data.FAPStatus==0){
								if(data.success==true){
									$("#mark_one").css("display","block").find(".text").text("支付密码重置成功");
									$("#sure").off("click").on("click",function(){
										$scope.toMain(publicStr);
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
						},error : function() {
							//location = "index.html";
						}
					});
				}else{
					$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
					$(".error_message").css("background","#FFC0CB");
					$(".error_message").css("opacity","1").find("b").text("两次输入的支付密码不一致");
				}
			}
		}else{
			$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
			$(".error_message").css("background","#FFC0CB");
		}
	})
	//点击弹框关闭按钮
	 $scope.close=function(){
		$("#mark_one").css("display","none");
	 }
};
angular.module("myapp")
		.controller("resetPsw",["$scope","$rootScope","$location","$state","$stateParams",resetPsw]);