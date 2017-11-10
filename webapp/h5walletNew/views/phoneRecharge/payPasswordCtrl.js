function payPasswordCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	//获取参数
	var params=angular.fromJson($stateParams.josnObj);
	$scope.customerNameCN=params.customerNameCN;//名字
	$scope.mobileNo=params.mobileNo;//手机号
	$scope.certNo=params.certNo;//身份证号
	var queryParam = angular.fromJson($stateParams.jsonPayObj);
	$scope.cardNo=queryParam.cardNo;//卡号
	$scope.money=queryParam.money;//支付金额
	$scope.mobile=queryParam.mobile;//充值手机号
	$scope.sellPrice=queryParam.sellPrice;//销售价格
	$scope.areaName=queryParam.areaName;//省份
	$scope.carrierName=queryParam.carrierName;//产品类别移动、联通、电信
	$scope.ppiId=queryParam.ppiId;//产品ID
	$scope.payType=queryParam.payType;//支付类型
	$scope.moneys=fmoney($scope.sellPrice,2);
	//手机充值支付密码图标
	$(".payPassword h3 img").attr("src",imgRrc+"h5images/icon_zhuannext_money_w"+variable+".png");
	
	//更换支付方式
	$scope.replace=function(){
        var obj = {certNo:$scope.certNo,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,mobile:$scope.mobile,sellPrice:$scope.sellPrice,ppiId:$scope.ppiId,areaName:$scope.areaName,carrierName:$scope.carrierName,money:$scope.money,dataType:"4",payType:"5"};
        var jsonObj= angular.toJson(obj);

        $state.go("payWay",{'josnObj':jsonObj});
	};
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
				var parm = {};
		    	var encryption="amount="+$scope.money+"&areaName="+$scope.areaName+"&cardNo="+encryptByDES($scope.cardNo)+"&carrierName="+$scope.carrierName+"&customerNo="+$scope.customerNo+"&mobileNo="+encryptByDES($scope.mobile)+"&paychannel=004&payPassword="+encryptByDES(inp_v)+"&payType="+$scope.payType+"&ppiId="+$scope.ppiId+"&sellPrice="+$scope.sellPrice;
		    	console.log(inp_v)
		    	console.log($scope.sellPrice+" "+$scope.money)
				parm.customerNo = $scope.customerNo;//客户号
				parm.sessionId = $scope.sessionId;//令牌号
				parm.mobileNo = encryptByDES($scope.mobile);//手机号
				parm.amount = $scope.money;//缴费金额
				parm.sellPrice = $scope.sellPrice;//销售价格
				parm.payType = $scope.payType;//支付类型
				parm.cardNo = encryptByDES($scope.cardNo);//支付卡号
				parm.ppiId = $scope.ppiId;//产品Id
				parm.areaName = $scope.areaName;// 省份
				parm.carrierName = $scope.carrierName;//产品类别移动、联通、电信 
				parm.payPassword = encryptByDES(inp_v);// 支付密码
				parm.paychannel="004";//代表pc
				parm.signKey=publicKeyRSA(md5(encryption));
				$.ajax({
					url :getRootPath()+"/ChargingPaymentAction.mobileRechargeCreateBill.do?FAPView=JSON",
					type: 'post',
					data : parm,
					success : function(data) {
						var data=$.parseJSON(data);
						console.log(data);
						if(data.FAPStatus==0){
							if(data.success==true){
								if(data.data.payPaymentStatus==0){
									$(".mask_in").hide().siblings(".mask_success").show();
									var obj = {orderStatus:data.data.transactionOrderDetail.orderStatus,sellPrice:$scope.sellPrice,goodsInf:data.data.transactionOrderDetail.goodsInf,mobile:$scope.mobile,amount:$scope.money,merchName:data.data.transactionOrderDetail.merchName,createTime:data.data.transactionOrderDetail.createTime,orderNo:data.data.transactionOrderDetail.orderNo};
									var jsonObj= angular.toJson(obj);
									setTimeout(function(){
			 	    					$(".mask").hide();
			 	    					$state.go('topUpSuccess',{'josnObj':jsonObj});
			 	    				},2000);
								}else{
									$(".login_mask").show().text(data.data.errMsg).siblings(".mask").hide().siblings(".mask_all").hide();
					    			setTimeout(function(){
				    					$(".login_mask").hide();
				    				},2000);
				    				$(".i-text").val("");
					    			$(".sixDigitPassword").find("i").removeClass("active");
					    			$(".sixDigitPassword").find("b").css({"display":"none"});
								}
								
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
						//alert("错误");
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
		.controller("payPasswordCtrl",['$scope','$stateParams','$state','$ionicModal',payPasswordCtrl]);