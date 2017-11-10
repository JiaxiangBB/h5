function transferCtrl($scope,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	//初始化显示
	$scope.transfer=true;
	$scope.transferNum=false;
	
	//转账输入框图标
	$(".num img").attr("src",imgRrc+"h5images/icon_zhuanqszh_tel"+variable+".png");
	$(".money img").attr("src",imgRrc+"h5images/icon_zhuannext_money"+variable+".png");
	$(".text img").attr("src",imgRrc+"h5images/icon_zhuanzh_warm"+variable+".png");
	
	//没有记录时的背景图
	$(".empty img").attr("src",imgRrc+"h5images/icon_wujilu@3x.png");

	//转账功能
	//输入转账账户
	$(".phoneNum").keyup(function(){
		if($(this).val()==""){
			$(".next").css("opacity","0.4");
		}else{
			$(".next").css("opacity","1");
		}
	});
	//输入转账金额
	$(".transferMoney").keyup(function(){
		if($(this).val()==""){
			$(".submit").css("opacity","0.4");
		}else{
			$(".submit").css("opacity","1");
		}
	});
	//点击下一步
	$scope.next=function(){
		if($(".phoneNum").val()!=""){
			$(".next").css("opacity","0.4").attr('disabled',"true");
			var rules_phone = /^1[34578][0-9]{9}$/;
	    	var isTel=rules_phone.test($(".phoneNum").val()); 
			if(isTel){
				var parms = {};
				parms.customerNo = $scope.customerNo;//客户号
				parms.sessionId = $scope.sessionId;//令牌号
				parms.userName = $(".phoneNum").val();//收款用户名
				parms.userType = "p";
				$.ajax({
					url :getRootPath()+"/CustomerAction.userCheck.do?FAPView=JSON",
					type: 'post',
					data : parms,
					success : function(data) {
						var data=$.parseJSON(data);
						//console.log(data);
						$(".next").css("opacity","1").removeAttr("disabled");
						if(data.FAPStatus==0){
							if(data.success==true){
								if(data.data.authstatus=="0"){
									//alert("对方账户未实名");
									$scope.msg = "对方账户未实名";
									$scope.openModalThree();
									setTimeout(function(){
										$scope.closeModalThree();
									},1000*3);
								}else{
									$scope.name=data.data.userName;
									$scope.phone=$(".phoneNum").val();
									$scope.transfer=false;
									$scope.transferNum=true;
									$scope.$apply();
								}
							}else{
								//alert(data.errors.msg);
								$scope.msg = data.errors.msg;
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
							}
						}else if(data.FAPStatus==2){
							loginH5Host();//从新调登录接口
						}else{
							//alert(data.FAPErrorMessage);
							$scope.msg = data.FAPErrorMessage;
							$scope.openModalThree();
							setTimeout(function(){
								$scope.closeModalThree();
							},1000*3);
						}
					},
					error:function(a,b,c){
					//	alert("错误");
					}					
				});
			}else{
				//alert("手机号格式错误");
				$scope.msg = "手机号格式错误";
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}
		}else{
			//alert("手机号不可为空");
			$scope.msg = "手机号不可为空";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}
	};
	//点击提交至输入支付密码
	$scope.transferPassword=function(){
		if($(".transferMoney").val()!=""){
			var rules_money =/^\d+(\.\d+)?$/;
			var isMoney = rules_money.test($(".transferMoney").val());
			if(isMoney){
				if($(".transferInstructions").val().length<=20){
					var recAcc = $(".phoneNum").val();//收款账户
					var amount = $(".transferMoney").val();//转账金额
					var remark = $(".transferInstructions").val();//备注
					var name = $(".transferNum h2").text();//收款人姓名
					var obj = {recAcc:recAcc,amount:amount,remark:remark,name:name};
	    			var jsonObj= angular.toJson(obj);
					$state.go('transferPassword',{'josnObj':jsonObj});
				}else{
					//alert("转账说明需20字以内");
					$scope.msg = "转账说明需20字以内";
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			}else{
				//alert("金额格式错误");
				$scope.msg = "金额格式错误";
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}
		}else{
			//alert("金额不可为空");
			$scope.msg = "金额不可为空";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}
	};

	// 弹框
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
		.controller("transferCtrl",['$scope','$state','$ionicModal',transferCtrl]);