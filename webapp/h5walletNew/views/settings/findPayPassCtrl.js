function findPayPassCtrl($scope,$ionicModal,$state,$stateParams){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	//找回支付密码 图片
	$("#findPayPass-view .resetPayPass .lock").css("background-image","url("+imgRrc+"h5images/icon_mima_black"+variable+".png)");
	
	//获取url中的参数信息
	var queryParam = angular.fromJ
	son($stateParams.jsonObj);
	// $scope.certType = queryParam.certType;//是否实名
	// $scope.customerNameCN = queryParam.customerNameCN;//姓名
	$scope.mobileNo = queryParam.mobileNo;//手机号
	$scope.certType = queryParam.certType;
	$scope.customerNameCN = queryParam.customerNameCN;
	$scope.certNo = queryParam.certNo;
	// //截取身份证号中间十位数
	// var certNo = queryParam.certNo.substring(4,queryParam.certNo.length-4);
	// //console.log(certNo);
	// $scope.certNo = queryParam.certNo.substr(0,4)+certNo.replace(certNo,"**********")+queryParam.certNo.substr(queryParam.certNo.length-4,4)
	// $scope.certNo = queryParam.certNo;//身份证
	//console.log(queryParam);
	//console.log($scope.mobileNo);
	var obj = {certType:$scope.certType,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo};
	var jsonObj= angular.toJson(obj);
	console.log(jsonObj);
	//判断支付密码 格式 rules_pay 正则   pay_password
	$scope.rules_password = function(rules_password){
	    var message_psw="";
	    var rules_login =  /^\d{6}$/;
	    var isPsw= rules_login.test(rules_password);
	    if(rules_password==""){
	    	$scope.msg = "密码不可为空";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
	        message_psw=false;
	    }else{
	        if(isPsw==true){
	            message_psw=true;
	        }else{
	        	$scope.msg = "必须输入6位有效数字";
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
	            message_psw=false;
	        }
	    }
	    return message_psw;
	};
	//短信验证调用接口
	$scope.sendPhoneCode = function(){
		if(true){
			var parms = {};
			parms.mobileNo=encryptByDES($scope.mobileNo);//手机号
			$.ajax({
				url :getRootPath()+"/PublicAction.sendSmsCode.do?FAPView=JSON",
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							sendMessage();
						}else{
							$scope.msg = data.errors.msg;
							$scope.openModalThree();
							setTimeout(function(){
								$scope.closeModalThree();
							},1000*3);
						}
					}else if(data.FAPStatus==2){
						loginH5Host();//从新调登录接口
					}else{
						$scope.msg = $scope.FAPErrorMessage;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);		
					}
				},
				error:function(a,b,c){
//					alert("错误");
				}
			});
		}
	}
	//下一步
	$scope.resetpay_submit=function(){
    	curCount=0;
	    var message_code = $(".getCode .msgCode").val();//手机验证码
	    console.log(message_code);
		if(message_code!==""){
			$("#findPayPass-view .findPayPswd").css("display","none");
			$("#findPayPass-view .findPayPswdSub").css("display","block");
		}else{
			$scope.msg = "短信验证码不能为空";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}
    };
    //重置密码 提交
	 $scope.reset_paypassword=function(){
	 	//alert(1);
		var password=$("#newPassword").val();
    	var confirmPassword=$("#confiemNewPassword").val();
    	var message_code = $(".getCode .msgCode").val();//手机验证码
    	//console.log(password);
    	//console.log(confirmPassword);
    	if($scope.rules_password(password) == true){
    		if($scope.rules_password(confirmPassword) == true){
				if(password == confirmPassword){
					var parms={};
			    	parms.customerNo = $scope.customerNo;//客户号
					parms.sessionId = $scope.sessionId;//令牌号
					parms.userName = encryptByDES($scope.mobileNo);//手机号
					parms.findWay = 0;//手机找回
					parms.password = encryptByDES(password);//新密码
					parms.confirmPassword = encryptByDES(confirmPassword);//确认密码
					parms.smsCode=encryptByDES(message_code);//手机验证码
					$.ajax({
						url :getRootPath()+"/SecurityCenterAction.findPayPwd.do?FAPView=JSON",
						data : parms,
						success : function(data) {
							var data=$.parseJSON(data);
							$scope.FAPErrorMessage = data.FAPErrorMessage;
							console.log(data);
							if(data.FAPStatus==0){
								if(data.success==true){
									$scope.msg = "新支付密码设置成功";
									$scope.openModalThree();
									setTimeout(function(){
										$scope.closeModalThree();
									},1000*3);
									$state.go('settings',{'jsonObj':jsonObj});
								}else{
									// $(".error_message").find("img").attr("src",$rootScope.imagesSRC+"login/cuowu.png");
									// $(".error_message").css("background","#FFC0CB");
									// $(".error_message").css("opacity","1").find("b").text(data.errors.msg);
								}	
							}else if(data.FAPStatus==2){
								loginH5Host();//从新调登录接口
							}else if(data.FAPStatus==1){
								$scope.msg = $scope.FAPErrorMessage;
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
							}
						},error : function() {
							//location = "index.html";
						}
					});
				}else{
					$scope.msg = "两次输入的支付密码不一致"
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
    		}else{

    		};
    	}else{
    		
    	};

	};

	//弹框
	$ionicModal.fromTemplateUrl('templates/modalThree.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalThree = modal;
	});
	$scope.openModalThree = function() {
		$scope.modalThree.show();
	};
	$scope.closeModalThree = function() {
		$scope.modalThree.hide();
	};
};
angular.module("myapp")
		.controller("findPayPassCtrl",['$scope','$ionicModal','$state','$stateParams',findPayPassCtrl]);