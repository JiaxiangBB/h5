function paymentPasswordCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=getURLParameter("sessionId");
	//获取参数
	var params=angular.fromJson($stateParams.josnObj);
	$scope.customerNameCN=params.customerNameCN;//名字
	$scope.mobileNo=params.mobileNo;//手机号
	$scope.certNo=params.certNo;//身份证号
	var queryParam = angular.fromJson($stateParams.jsonPayObj);
	$scope.userNo=queryParam.userNo;//编号
	$scope.money=queryParam.money;//支付金额
	$scope.moneys=fmoney($scope.money,2);

	var date = new Date();
	var year=date.getFullYear(); 
	var month=date.getMonth()+1;
	if(parseInt(month)<10){
		month="0"+month;
	}
	var yearmonth=year+month;
	
	console.log(queryParam)
	//手机充值支付密码图标
	$(".payPassword h3 img").attr("src",imgRrc+"h5images/icon_zhuannext_money_w"+variable+".png");
	
	//更换支付方式
	$scope.replace=function(){
        var obj = {certNo:$scope.certNo,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobile,money:$scope.money,dataType:"4",payType:"4",areaName:queryParam.areaName,receiverName:queryParam.receiverName,userNo:queryParam.userNo,itemName:queryParam.itemName,picoid:queryParam.picoid,pid:queryParam.pid,cid:queryParam.cid,truename:queryParam.truename,protype:queryParam.protype,phsid:queryParam.phsid};
        var jsonObj= angular.toJson(obj);
		$state.go("paymentWay",{josnObj:jsonObj});
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
				var parms = {};
		    	var encryption="amount="+queryParam.money+"&areaName="+queryParam.areaName+"&cardNo="+encryptByDES("")+"&cid="+queryParam.cid+"&customerNo="+$scope.customerNo+"&inOrderorgi=02&itemName="+queryParam.itemName+"&payChannel=005&payPassword="+encryptByDES($(".i-text").val())+"&payType=01&phsid="+queryParam.phsid+"&picoid="+queryParam.picoid+"&pid="+queryParam.pid+"&protype="+queryParam.protype+"&receiverName="+queryParam.receiverName+"&truename="+queryParam.truename+"&userNo="+encryptByDES(queryParam.userNo)+"&yearmonth="+yearmonth;
		    	parms.customerNo=$scope.customerNo;
				parms.sessionId=$scope.sessionId;
				parms.areaName=queryParam.areaName;//缴费区域
				parms.receiverName=queryParam.receiverName;//公共事业单位名称
				parms.userNo=encryptByDES(queryParam.userNo);//水电煤卡号
				parms.amount=queryParam.money;//金额
				parms.payType="01";//支付类型
				parms.payChannel="005";//支付渠道
				parms.itemName=queryParam.itemName;//缴费项目
				parms.inOrderorgi="02";//订单来源
				parms.picoid=queryParam.picoid;//公司产品编号
				parms.pid=queryParam.pid;//所属省或直辖市
				parms.cid=queryParam.cid;//所属城市
				parms.truename=queryParam.truename;//户主名字
				parms.yearmonth=yearmonth;//账单月份
				parms.cardNo=encryptByDES("");//支付卡号
				parms.protype=queryParam.protype;//产品类型
				parms.phsid=queryParam.phsid; 
				parms.payPassword=encryptByDES($(".i-text").val());//支付密码
				parms.signKey=publicKeyRSA(md5(encryption));
				$.ajax({
					url :getRootPath()+"/ChargingPaymentAction.publicPaymentCreateBill.do?FAPView=JSON",
					type: 'post',
					data : parms,
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
			 	    					$state.go('paymentSuccess'/*,{'josnObj':jsonObj}*/);
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
		.controller("paymentPasswordCtrl",['$scope','$stateParams','$state','$ionicModal',paymentPasswordCtrl]);
