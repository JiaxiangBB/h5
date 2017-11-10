/*--------------------------------------设置支付密码------------------------------------------------*/
function payPassword($scope,$rootScope,$location,$state,$stateParams){
	//获取wrap页面的参数         
	//解析url参数     wrap页面    publicStr
	var obj="";
	var str = $stateParams.publicStr;
	if(str==""){
		
	}else{
		var privateStr=privateKey(str);
		obj=angular.fromJson(privateStr);
	}
	var payPwdFlag;
   $scope.customerNo = obj.customerNo;
   $scope.sessionId = obj.sessionId; 
   $scope.mobile = obj.mobile;
   $scope.customerNameCN = obj.customerNameCN;  
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
   var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
	var publicStr=publicKey(str);
	var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}'
	var moneyStr=publicKey(mstr);
	//点击返回按钮
	$(".approve_back").off("click").live("click",function(){
		$scope.tosafety (publicStr,moneyStr);
	})
	
	//设置支付密码 提交
	$("#payPsw").focus(function(){
		$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
		$(".error_message").css("background","#BCD2EE");
		$(".error_message").css("opacity","1").find("b").text("请确保支付密码与登录密码不同")
	})
	$("#payPsw").blur(function(){
		var pay_password=$("#payPsw").val();
		var tab_img=$("#pay_pass2");
		var tab_login=$(".error_message").find("b");
		error.payPassword(pay_password,tab_img,tab_login);
		if(error.payPassword(pay_password,tab_img,tab_login)==true){
			if($("#confirm_psw").val()==""){
				$(".error_message").find("img").attr("src",$rootScope.imagesSRC+"remind/tixing.png");
				$(".error_message").css("background","#BCD2EE");
				$(".error_message").css("opacity","1").find("b").text("请确保两次输入支付密码相同");
			}
			$scope.set_paypassword_login=function(){
				var payPsw=$("#payPsw").val();
				var confirm_psw=$("#confirm_psw").val();
				if(payPsw==confirm_psw){
					var parms={};
					parms.password=encryptByDES($scope.password);
					parms.cstNo=$scope.customerNo;
					parms.payPwd=encryptByDES(payPsw);
					$.ajax({
						url : getRootPath()+"/SystemAction.setPayPwd.do?FAPView=JSON",
						data : parms,
						success : function(data) {
							var data=$.parseJSON(data);
							//console.log(data);
							if(data.FAPStatus==0){
								if(data.success==true){
									var result=data.data.result;
									$scope.payPwdFlag=result;
									$("#mark_one").css("display","block").find(".text").text("支付密码设置成功");
									$(".true").off("click").live("click",function(){
										var payPwdFlag=data.data.result;
										$("#mark_one").css("display","none");
										var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
										var publicStr=publicKey(str);
										$scope.tosafety (publicStr,moneyStr);
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
	.controller("payPassword",["$scope","$rootScope","$location","$state","$stateParams",payPassword]);