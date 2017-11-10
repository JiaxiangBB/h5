function transferPasswordCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	var queryParam = angular.fromJson($stateParams.josnObj);
	$scope.recAcc = queryParam.recAcc;//收款账户
	$scope.amount = queryParam.amount;//转账金额
	$scope.remark = queryParam.remark;//备注
	$scope.name = queryParam.name;//收款人姓名
	$scope.money=fmoney($scope.amount,2);

	//输入密码图标
	$(".payPassword img").attr("src",imgRrc+"h5images/icon_zhuannext_money_w"+variable+".png");
	//输入支付密码动画
	//动画
	payPassword();
	$(".i-text").keyup(function(){
		var inp_v = $(this).val();
		var inp_l = inp_v.length;
		//$("h3").html( "input的值为：" + inp_v +"; " + "值的长度为:" + inp_l);//测试用
		//console.log(inp_v)
		for( var x = 0; x<=6; x++)
		{
			//$("h3").html( inp_l );//测试
			
			$(".sixDigitPassword").find("i").eq( inp_l ).addClass("active").siblings("i").removeClass("active");
			$(".sixDigitPassword").find("i").eq( inp_l ).prevAll("i").find("b").css({"display":"block"});
			$(".sixDigitPassword").find("i").eq( inp_l - 1 ).nextAll("i").find("b").css({"display":"none"});
			
			if( inp_l == 0)
			{
				$(".sixDigitPassword").find("i").eq( 0 ).addClass("active").siblings("i").removeClass("active");
				$(".sixDigitPassword").find("b").css({"display":"none"});
			}
			else if( inp_l == 6)
			{
				$(".sixDigitPassword").find("b").css({"display":"block"});
				$(".sixDigitPassword").find("i").eq(5).addClass("active").siblings("i").removeClass("active");
			}
				
		}
		if(inp_l==6){
			//判断密码输入完成
			$(".mask").show().siblings(".mask_all").show().find(".mask_in").show();
			//检测密码
			function isPsw() {
				var psw = inp_v;
			    var rules = /^\d{6}$/;
			    return rules.test(psw);
			};
			if(isPsw()==true){
				var encryption="amount="+$scope.amount+"&customerNo="+$scope.customerNo+"&mobileNo=&password="+encryptByDES(inp_v)+"&recAcc="+encryptByDES($scope.recAcc)+"&remark="+$scope.remark+"&smsCode=&smsFlg=0&touchID=&verifyCode=";
	  			//console.log(encryption);
	  			//console.log(md5(encryption));
				var parms = {};
				parms.customerNo = $scope.customerNo;//客户号
				parms.sessionId = $scope.sessionId;//令牌号
				parms.recAcc = encryptByDES($scope.recAcc);//收款用户名
				parms.amount = $scope.amount;//转账金额
				parms.password = encryptByDES(inp_v);//转账密码  支付密码
				parms.smsFlg = 0;//发短信标志
				parms.remark=$scope.remark;//备注
				parms.mobileNo="";
				parms.smsCode="";
				parms.touchID="";
				parms.verifyCode="";
				parms.signKey=publicKeyRSA(md5(encryption));
				//console.log(parms.signKey);
				
				$.ajax({
					url :getRootPath()+"/TransactionAction.accTransfer.do?FAPView=JSON",
					type: 'post',
					data : parms,
					success : function(data) {
						var data=$.parseJSON(data);
						console.log(data);
						if(data.FAPStatus==0){
							if(data.success==true){
								$(".mask_in").hide().siblings(".mask_success").show();
								var obj = {recAcc:$scope.recAcc,amount:$scope.amount,name:$scope.name,fapTime:data.FAPTime,orderId:data.data.orderId};
	    						var jsonObj= angular.toJson(obj);
								setTimeout(function(){
		 	    					$(".mask_success").hide();
		 	    					$state.go('transferSuccess',{'josnObj':jsonObj});
		 	    				},2000);
							}else{
								$(".login_mask").show().text(data.errors.msg).siblings(".mask").hide().siblings(".mask_all").hide();
				    			setTimeout(function(){
			    					$(".login_mask").hide();
			    				},2000);
			    				$(".i-text").val("");
				    			$(".sixDigitPassword").find("i").removeClass("active");
				    			$(".sixDigitPassword").find("b").css({"display":"none"});
							}
						}else if(data.FAPStatus==2){
							loginH5Host();//从新调登录接口
						}else{
							$(".login_mask").show().text(data.FAPErrorMessage).siblings(".mask").hide().siblings(".mask_all").hide();
			    			setTimeout(function(){
		    					$(".login_mask").hide();
		    				},2000);
		    				$(".i-text").val("");
			    			$(".sixDigitPassword").find("i").removeClass("active");
			    			$(".sixDigitPassword").find("b").css({"display":"none"});
						}
					},
					error:function(a,b,c){
					//	alert("错误");
					}					
				});
			}else{
				$(".login_mask").show().text("支付密码格式错误，请重试").siblings(".mask").hide().siblings(".mask_all").hide();
    			setTimeout(function(){
					$(".login_mask").hide();
				},2000);
			}
		}
	});
};
angular.module("myapp")
		.controller("transferPasswordCtrl",['$scope','$stateParams','$state','$ionicModal',transferPasswordCtrl]);