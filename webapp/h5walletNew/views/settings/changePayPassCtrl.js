function changePayPassCtrl($scope,$state,$ionicModal,$stateParams){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	//获取url中的参数信息
	var queryParam = angular.fromJson($stateParams.jsonObj);
	$scope.certType = queryParam.certType;//是否实名
	$scope.customerNameCN = queryParam.customerNameCN;//姓名
	$scope.mobileNo = queryParam.mobileNo;//手机号
	//console.log($scope.mobileNo);
	//$scope.certType = queryParam.certType;
	//$scope.customerNameCN = queryParam.customerNameCN;
	$scope.certNo = queryParam.certNo;
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
	//修改支付密码  第一个input 获取焦点 触发函数
	$("#enterPassword .psw01").off("focus").on("focus",function(){
		var enterPassword =document.getElementById("enterPassword").getElementsByTagName("input");
	 	//console.log(enterPassword.length);
	 	for(var i=0;i<enterPassword.length;i++){
	 		var t = enterPassword[i];
	 		t.index = i;
	 		t.setAttribute("readonly",true);
	 		//console.log(t.index);
	 		t.onkeyup = function(){
	 			this.value = this.value.replace(/^(.).*$/,'$1');
	 			var next = this.index + 1;
	 			if (next > enterPassword.length - 1) return;
	 			enterPassword[next].removeAttribute("readonly");
	 			enterPassword[next].focus();
	 		};
	 	}
	 	enterPassword[0].removeAttribute("readonly");
	});

	//1.输入当前支付密码时 input06 触发函数
	$("#enterPassword .psw06").keyup(function(){
		//获取 当前支付密码 输入框的内容
		var enterPsw01 = $("#enterPassword .psw01").val();
		var enterPsw02 = $("#enterPassword .psw02").val();
		var enterPsw03 = $("#enterPassword .psw03").val();
		var enterPsw04 = $("#enterPassword .psw04").val();
		var enterPsw05 = $("#enterPassword .psw05").val();
		var enterPsw06 = $("#enterPassword .psw06").val();
		//原密码
		var currentPayPassword = enterPsw01+enterPsw02+enterPsw03+enterPsw04+enterPsw05+enterPsw06;
		//var rules_password = currentPayPassword;
		//$scope.rules_password(rules_password);
		var currentPayPsd = currentPayPassword.length;
		console.log(currentPayPsd);
		if(currentPayPsd == 6){//判断输入当前密码时 最后一个input val长度为1时进入下一步
			if($scope.rules_password(currentPayPassword)==true){
				$(".currentPayPassword").css("display","none");
				$(".newPayPassword").css("display","block");
				$("#newPasswords .psw01").off("focus").on("focus",function(){
					var newPasswords =document.getElementById("newPasswords").getElementsByTagName("input");
					//console.log(newPasswords.length);
					for(var y=0;y<newPasswords.length;y++){
				 		var t = newPasswords[y];
				 		t.index = y;
				 		t.setAttribute("readonly",true);
				 		//console.log(t.index);
				 		t.onkeyup = function(){
				 			this.value = this.value.replace(/^(.).*$/,'$1');
				 			var next = this.index + 1;
				 			if (next > newPasswords.length - 1) return;
				 			newPasswords[next].removeAttribute("readonly");
				 			newPasswords[next].focus();
				 		};
				 	}
				 	newPasswords[0].removeAttribute("readonly");
				 	//console.log(newPasswords[0]);
				});
			}else{

			}	
		}else{
			$scope.msg = "必须输入6位有效数字";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}
	});

	//2.输入新密码时 input06 触发函数
	$("#newPasswords .psw06").keyup(function(){
		//获取 输入新支付密码 输入框的内容
		var newPsw01 = $("#newPasswords .psw01").val();
		var newPsw02 = $("#newPasswords .psw02").val();
		var newPsw03 = $("#newPasswords .psw03").val();
		var newPsw04 = $("#newPasswords .psw04").val();
		var newPsw05 = $("#newPasswords .psw05").val();
		var newPsw06 = $("#newPasswords .psw06").val();
		//新密码
		var newPasswords = newPsw01+newPsw02+newPsw03+newPsw04+newPsw05+newPsw06;
		var newPsds = newPasswords.length;
		var lastInput = $("#newPasswords .psw06").val().length;
		console.log(newPsds);
		if(newPsds == 6){
			if($scope.rules_password(newPasswords) == true){
				$(".newPayPassword").css("display","none");
				$(".surePayPassword").css("display","block");
				$("#surePassword .psw01").off("focus").on("focus",function(){
					var surePassword =document.getElementById("surePassword").getElementsByTagName("input");
					//console.log(newPasswords.length);
					for(var y=0;y<surePassword.length;y++){
				 		var t = surePassword[y];
				 		t.index = y;
				 		t.setAttribute("readonly",true);
				 		//console.log(t.index);
				 		t.onkeyup = function(){
				 			this.value = this.value.replace(/^(.).*$/,'$1');
				 			var next = this.index + 1;
				 			if (next > surePassword.length - 1) return;
				 			surePassword[next].removeAttribute("readonly");
				 			surePassword[next].focus();
				 		};
				 	}
				 	surePassword[0].removeAttribute("readonly");
				});
			}else{

			};
		}else{
			$scope.msg = "必须输入6位有效数字";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}
	});
	//3.新支付密码确认  input06 触发函数
	$("#surePassword .psw06").keyup(function(){
		//确认 新的支付密码
		var surePsw01 = $("#surePassword .psw01").val();
		var surePsw02 = $("#surePassword .psw02").val();
		var surePsw03 = $("#surePassword .psw03").val();
		var surePsw04 = $("#surePassword .psw04").val();
		var surePsw05 = $("#surePassword .psw05").val();
		var surePsw06 = $("#surePassword .psw06").val();
		//确认新密码
		var surePassword = surePsw01+surePsw02+surePsw03+surePsw04+surePsw05+surePsw06;
		var surePsd = surePassword.length;
		// var lastInput = $("#surePassword .psw06").val().length;
		//console.log(surePsd);
		if(surePsd == 6){
			if($scope.rules_password(surePassword) == true){
				//获取 当前支付密码 输入框的内容
				var enterPsw01 = $("#enterPassword .psw01").val();
				var enterPsw02 = $("#enterPassword .psw02").val();
				var enterPsw03 = $("#enterPassword .psw03").val();
				var enterPsw04 = $("#enterPassword .psw04").val();
				var enterPsw05 = $("#enterPassword .psw05").val();
				var enterPsw06 = $("#enterPassword .psw06").val();
				//获取 输入新支付密码 输入框的内容
				var newPsw01 = $("#newPasswords .psw01").val();
				var newPsw02 = $("#newPasswords .psw02").val();
				var newPsw03 = $("#newPasswords .psw03").val();
				var newPsw04 = $("#newPasswords .psw04").val();
				var newPsw05 = $("#newPasswords .psw05").val();
				var newPsw06 = $("#newPasswords .psw06").val();
				//原密码
				var currentPayPassword = enterPsw01+enterPsw02+enterPsw03+enterPsw04+enterPsw05+enterPsw06;
				//console.log(currentPayPassword);
				//新密码
				var newPasswords = newPsw01+newPsw02+newPsw03+newPsw04+newPsw05+newPsw06;
				//console.log(newPasswords);	
				var parms = {};
				parms.customerNo = $scope.customerNo;//客户号
				parms.sessionId = $scope.sessionId;//令牌号
				parms.oldPassword = encryptByDES(currentPayPassword);//原密码
				parms.newPassword = encryptByDES(newPasswords);//新密码
				parms.confirmPassword = encryptByDES(surePassword);//确认新密码		
				$.ajax({
					url :getRootPath()+"/SecurityCenterAction.modifyPayPwd.do?FAPView=JSON",
					data : parms,
					success : function(data) {	
						var data=$.parseJSON(data);
						console.log(data);
						$scope.FAPErrorMessage = data.FAPErrorMessage;
						if(data.FAPStatus==0){
							if(data.success==true){
								$scope.msg = "支付密码修改成功";
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
								$state.go('settings',{'jsonObj':jsonObj});
							}else{
								$scope.msg = data.errors.msg;
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
							}
						}else if(data.FAPStatus==2){
							loginH5Host();//从新调登录接口
							// $("#mark_one").css("display","block").find(".text").text("请重新登录");
							// $(".change").off("click").live("click",function(){
					  		// $("#mark_one").css("display","none");
					  		// window.location.href="./index.html";
					  		// })
						}else if(data.FAPStatus==1){
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
			}else{

			};
		}else{
			$scope.msg = "必须输入6位有效数字";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}
	});
	//认证失败 弹框
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
		.controller("changePayPassCtrl",['$scope','$state','$ionicModal','$stateParams',changePayPassCtrl]);