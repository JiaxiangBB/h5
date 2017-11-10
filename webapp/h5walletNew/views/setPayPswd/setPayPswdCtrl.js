function setPayPswdCtrl($scope,$stateParams,$state,$http,$ionicModal){
	// //订单详情图片
	// $(".applyOrder h2 img").attr("src",imgRrc+"h5images/icon_zhuannext_money_w"+variable+".png");
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.loginname=getQueryString("loginname");

	console.log($scope.loginname);
	$scope.setPayPswdFun = function(){
		var payPswd = $(".currentPayPassword .payPswd").val();
		var confirpayPswd = $(".currentPayPassword .confirPayPswd").val();
		//校验6位支付密码
		var rules_payPswd =  /^\d{6}$/;

		var isPsw= rules_payPswd.test(payPswd);
		var isConfirPsw = rules_payPswd.test(confirpayPswd);

		if(payPswd == "" || confirpayPswd == ""){
			$scope.msg = "密码不可为空";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}else{
			if(payPswd == confirpayPswd){
				if(isPsw == true || isConfirPsw == true){
					var encryption = "payPwd="+encryptByDES(confirpayPswd)+"&cstNo="+$scope.customerNo;
					console.log(md5("12345678").toUpperCase());
					//console.log(md5(encryption));
					var md5info=md5(encryption+"&"+md5("12345678").toUpperCase()).toUpperCase();
					console.log(md5info);
					var parms = {};
					parms.cstNo =$scope.customerNo;//客户号
					parms.payPwd = encryptByDES(confirpayPswd);//支付密码
					parms.md5info = md5info;
					$.ajax({
						url :getRootPath()+"/BusinessEntraceAction.setPayPwd.do?FAPView=JSON",
						data : parms,
						success:function(data){
							var data=$.parseJSON(data);
							console.log(data);
							//$scope.FAPErrorMessage = data.FAPErrorMessage;
							if(data.FAPStatus==0){
								if(data.success==true){
									//alert("成功")
									localStorage.setItem("payPwdData",confirpayPswd);//是否设置支付密码 保存
									$scope.msg = "支付密码设置成功"
									$scope.openModalThree();
									setTimeout(function(){
										$scope.closeModalThree();
									},1000*2);
									var Obj={customerNo:$scope.customerNo,loginname:$scope.loginname};
									var jsonObj= angular.toJson(Obj);
									$state.go('home',{'josnObj':jsonObj});
								}else{
									$scope.msg = data.errors.msg;
									$scope.openModalThree();
									setTimeout(function(){
										$scope.closeModalThree();
									},1000*3);
								}
							}else if(data.FAPStatus==2){
								loginH5Host();//重新登录
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
					$scope.msg = "请输入6位数字支付密码";
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			}else{
				$scope.msg = "两次输入的支付密码不一致";
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}
		};
	};

	//调数字键盘
	window.onload = init();
    function init(){
        var x = document.getElementById("pass1");
        var payPswd = window.getComputedStyle(x);
        if(payPswd.webkitTextSecurity){
            //do nothing
        }else{
            x.setAttribute("type","password");
        }
        
        var y = document.getElementById("pass2");
        var configPswd = window.getComputedStyle(y);
        if(configPswd.webkitTextSecurity){
            //do nothing
        }else{
            y.setAttribute("type","password");
        }
    }

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
		.controller("setPayPswdCtrl",['$scope','$stateParams','$state','$http','$ionicModal',setPayPswdCtrl]);