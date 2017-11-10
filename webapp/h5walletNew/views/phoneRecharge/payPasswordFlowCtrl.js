function payPasswordFlowCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.customerNameCN=localStorage.getItem("customerNameData");//名字
	$scope.mobile=localStorage.getItem("mobileData");//手机号
	$scope.certNo=localStorage.getItem("certNoData");//身份证号

	var queryParam = angular.fromJson($stateParams.jsonPayObj);
	$scope.type=queryParam.type;//充值产品id
	console.log($scope.type);
	if($scope.type =="1"){
		$scope.state = "全国"
	}else if($scope.type =="2"){
		$scope.state = "本地"
	}
	$scope.moneys=queryParam.money;//支付金额
	$scope.cardNo=queryParam.cardNo;//银行卡号
	$scope.bankCardType=queryParam.bankCardType;//充值银行卡信息
	$scope.productId=queryParam.productId;//充值产品ID
	$scope.flow=queryParam.flow;//充值流量大小
	$scope.payType=queryParam.payType;//支付类型
	$scope.mobilePhone = queryParam.mobilePhone;//充值流量的手机号
	console.log(queryParam)
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
				//console.log($(".i-text").val());
				var parm = {};
		    	var encryption="cardNo="+encryptByDES($scope.cardNo)+"&customerNo="+$scope.customerNo+"&flow="+$scope.flow+"&mobileNo="+$scope.mobile+"&paychannel=008&payPassword="+encryptByDES($(".i-text").val())+"&payType="+"01"+"&productId="+$scope.productId+"&type="+$scope.type;
		    	console.log(inp_v);
				parm.customerNo = $scope.customerNo;//客户号
				parm.sessionId = $scope.sessionId;//sessionId
				parm.cardNo = encryptByDES($scope.cardNo);//支付银行卡号
				parm.flow = $scope.flow;//充值流量大小
				parm.mobileNo = $scope.mobilePhone;//充值号码
				parm.payPassword =encryptByDES($(".i-text").val());//支付密码
				parm.payType = "01";//支付类型
				parm.paychannel = "008";//订单来源
				parm.productId = $scope.productId;//充值的产品id
				parm.type = $scope.type;//	漫游属性
				parm.signKey=publicKeyRSA(md5(encryption));//签名
				console.log(encryption)
				console.log(parm.signKey)
				$.ajax({
					url :getRootPath()+"/GagaAction.requestCreateOrder.do?FAPView=JSON",
					type: 'post',
					data : parm,
					success : function(data) {
						var data=$.parseJSON(data);
						console.log(data);
						if(data.FAPStatus==0){
							if(data.success==true){
								if(data.data.payPaymentStatus==0){
									$(".mask_in").hide().siblings(".mask_success").show();
									var orderStatus = data.data.transactionOrderDetail.orderStatus;//充值状态
									var goodsInf = data.data.transactionOrderDetail.goodsInf;//充值说明
									var money = data.data.transactionOrderDetail.trxAmount;//充值金额
									var rcvCstName = data.data.transactionOrderDetail.rcvCstName//交易对象
									var createTime = data.data.transactionOrderDetail.createTime//创建时间
									var orderNo = data.data.transactionOrderDetail.orderNo//订单号
									var obj = {money:money,mobile:$scope.mobilePhone,orderStatus:orderStatus,goodsInf:goodsInf,rcvCstName:rcvCstName,createTime:createTime,orderNo:orderNo};
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
		.controller("payPasswordFlowCtrl",['$scope','$stateParams','$state','$ionicModal',payPasswordFlowCtrl]);