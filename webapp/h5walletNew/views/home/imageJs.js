function homeCtrl($scope,$ionicHistory,$state,$stateParams,$ionicModal,$ionicLoading){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");//sessionId
	$scope.payPwd = localStorage.getItem("payPwdData");//支付密码
	//$ionicLoading.show();//显示加载指示器
	//主入口图片 img 个数
	var imgNunm = $(".mainEntr .col-center img");
	$(".baseInfor").css("background-image","url("+imgRrc+"h5images/icon-rukou-backgroud"+variable+".png)");
	$(".rukouStar").css("background-image","url("+imgRrc+"h5images/icon-rukou-star"+variable+".png)");
	$(".homeFooter p img").attr("src",imgRrc+"h5images/icon-rukou-logo"+variable+".png");
	/*375 主入口图片*/
	for (var i=0;i<imgNunm.length;i++){
		$(".mainEntr .col-center img").eq(i).attr("src",imgRrc+"h5images/icon-"+ (i+1) + variable+".png");
	}
	
	//设置页面
	$("#settings-view .headPortrait img").attr("src",imgRrc+"h5images/icon_head_image"+variable+".png");
	//对接全时商城APP 
	$("#home-view .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");
	$("#home-view .myBills img").attr("src",imgRrc+"h5images/icon-4"+variable+".png");
	$("#home-view .setPayPswds img").attr("src",imgRrc+"h5images/icon-9"+variable+".png");
	//console.log(getQueryString("loginname"));//获取手机号 
	$scope.loginH5Host = function(){
	    //alert(9)
	    var parms = {};
	    parms.loginname = loginName;//登录名
	    parms.channel = "1001";//全时便利
	    parms.token = "";	    
	    var encryption = "loginname="+loginName+"&channel=1001"+"&token="+"";
	    //console.log(md5("12345678").toUpperCase());
	    //console.log(md5(encryption));
	    var md5info=md5(encryption+"&"+md5("12345678").toUpperCase()).toUpperCase();
	    //console.log(md5info);
	    parms.md5info=md5info;
	    $.ajax({
	        url :getRootPath()+"/BusinessEntraceAction.loginH5Host.do?FAPView=JSON",
	        data : parms,
	        success : function(data) {  
	            var data=$.parseJSON(data);
	            console.log(data);
	            var FAPErrorMessage = data.FAPErrorMessage;
	            if(data.FAPStatus==0){
	                //console.log(9)
	                if(data.success==true){
	                    var sessionId = data.data.sessionId;//sessionId
	                    var payPwd = data.data.payPwd;//是否设置支付密码
	                    var trueNameStatus = data.data.trueNameStatus;//是否实名
	                    var customerName = data.data.customerName;//姓名
	                    var mobile = data.data.mobile;//手机号
	                    var certNo = data.data.certNo;//身份证号

	                    //console.log(trueNameStatus);
	                    localStorage.setItem("data",sessionId);//将sessionId存储到key字段
	                    //var sessionId=localStorage.getItem("data");  
	                    localStorage.setItem("payPwdData",payPwd);//是否设置支付密码 保存
	                    //var payPwd=localStorage.getItem("payPwdData");  
	                    localStorage.setItem("trueNameStatusData",trueNameStatus);//将 判断是否实名 储存到localStorage
	                    //var trueName = localStorage.getItem("trueNameStatusData");  
	                    //console.log(trueName);
	                    localStorage.setItem("customerNameData",customerName);//姓名存储
	                    localStorage.setItem("mobileData",mobile);//手机号存储
	                    localStorage.setItem("certNoData",certNo);//身份证号
	                    //登陆成功之后 再调查询接口
	                    $scope.init();

	                }else{
	                    // var msg = data.errors.msg;
	                    // alert(msg)
	                    $scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
	                }
	            }else if(data.FAPStatus==2){
	                loginH5Host();
	            }else if(data.FAPStatus==1){
	                // var msg = FAPErrorMessage;
	                // alert(msg)
	                $scope.msg = FAPErrorMessage;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
	            }
	        },
	        error:function(a,b,c){
	//                  alert("错误");
	        }                   
	    });
	}
	$scope.loginH5Host();//登录接口
	//初始化信息
	$scope.init=function(){
		//账户余额
		var parms = {};
		parms.customerNo= $scope.customerNo;//客户号
		$.ajax({
			url :getRootPath()+"/PrepaidCardAction.cardBalQuery.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data.data);
				if(data.FAPStatus==0){
					if(data.success==true){
						$scope.accountBalance = fmoney(data.data.bankLists.avaAccountBalance,2);//总资产
						$scope.balance_wrap = fmoney(data.data.bankLists.avaBalance,2);//账户余额
						$scope.bankList = data.data.bankList;//全时通卡
						$scope.bankLists = data.data.bankLists;//账户
						$scope.card_num = $scope.bankList.length;//全时通卡张数
						//console.log($scope.bankList.length);
						//console.log($scope.bankLists);
						$scope.$digest();
						
						$scope.trueName = localStorage.getItem("trueNameStatusData");//是否实名
						$scope.customerName = localStorage.getItem("customerNameData");//姓名
						$scope.mobile = localStorage.getItem("mobileData");//手机号
						$scope.certNo = localStorage.getItem("certNoData");//身份证号
						var obj = {certType:$scope.certNo,customerNameCN:$scope.customerName,mobileNo:$scope.mobile,certNo:$scope.certNo};
						var jsonObj= angular.toJson(obj);
						console.log(jsonObj);

						$scope.toSettingsFun = function(){//去设置
							$state.go('settings',{'jsonObj':jsonObj});
						};

						//跳转其他页面
						$(".mainEntr .col").off("click").on("click",function(){
							//alert("yrhhhh")
							overall($(this),$scope.certNo,$scope.trueName,$scope.trueName,$scope.mobile)
						});

						$(".fullTimeCard").off("click").on("click",function(){//跳转全时通卡
							//点击跳转到全时通卡
							$state.go('fullTimeCard');
							//overall($(this),certNo,certType,customerNameCN,mobileNo)
						});
						$(".accountBalance").off("click").on("click",function(){//跳转账户余额
							//点击跳转到账户余额
							$state.go('accountBalance');
							//overall($(this),certNo,certType,customerNameCN,mobileNo)
						});

						//对接全时商城APP 跳转我的账单
						$scope.myBillsFun = function(){
							$state.go('billList');
						};
						//对接全时商城APP 跳转设置支付密码
						$scope.setPayPswdFun = function(){
							objpswd = {certNo:$scope.certNo,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo};
							var jsonObjpswd= angular.toJson(objpswd);
							$ionicHistory.clearCache();
							$state.go('setPayPswd',{'josnObj':jsonObjpswd});
						};	
					}else{
						$scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					}
				}else if(data.FAPStatus==2){
					//alert("请重新登录");
					loginH5Host();//从新调登录接口
				}else{
					$scope.msg = data.FAPErrorMessage;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			},
			error:function(a,b,c){
				alert("错误");
			}	
		});
	};
	
	//判断是否实名
	function overall(dataType,certNo,certType,customerNameCN,mobileNo){
		//alert("yrhhhh");
		var obj = {certNo:certNo,customerNameCN:customerNameCN,mobileNo:mobileNo};
	    var jsonObj= angular.toJson(obj);
	    //console.log(jsonObj);
	    var jsonPayObj = angular.toJson("");
		if(certType=="0"){
			//alert("请先实名认证");
			//实名认证弹框
			$ionicModal.fromTemplateUrl('templates/modalThree.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.modalThree = modal;
				//console.log($scope.modalSix)
				$scope.openModalThree = function() {
					$scope.modalThree.show();
				};
				$scope.closeModalThree = function() {
					$scope.modalThree.hide();
				};
				// //判断支付密码是否为空
				// if($scope.payPwd == ""){
				// 	$scope.openModalThree();
				// 	//点击取消按钮 关闭弹框
				// 	$scope.closeSetPswd = function(){
				// 		$scope.closeModalThree();
				// 	}
				// 	//点击确定按钮 去设置支付密码
				// 	$scope.sureSetPswd = function(){
				// 		$state.go('setPayPswd');
				// 		$scope.closeModalThree();
				// 	}
				// }else{

				// }
			});
			$scope.msg = "请先实名认证";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}else{	
			// if(dataType.attr("data-type")=="accountBalance"){//账户余额
			// 	var accountBalance = $(".baseInfor .accountBalance").text();//余额
			// 	//console.log(accountBalance);
			// 	var accountObj = {customerNameCN:customerNameCN,mobileNo:mobileNo,certNo:certNo,accountBalance:accountBalance};
			// 	var jsonAccountObj= angular.toJson(accountObj);
			// 	//console.log(jsonPayObj);
			// 	var payObj={cardNo:"",money:accountBalance,bankCardType:""};
			// 	var jsonPayObj = angular.toJson(payObj);
			// 	$state.go('accountBalance',{'jsonAccountObj':jsonAccountObj,'jsonPayObj':jsonPayObj});
			// };
			// //全时通卡
			// if(dataType.attr("data-type")=="fullTimeCard"){
			// 	$state.go('fullTimeCard',{'josnObj':jsonObj});
			// };
			//优惠券
			if(dataType.attr("data-type")=="coupons"){
				$state.go('coupons');
			};
			//添加银行卡
		    if(dataType.attr("data-type")=="bankList"){
				$state.go('bankList',{'josnObj':jsonObj});
			};
			//付款码
			if(dataType.attr("data-type")=="sweepTheYard"){
				var objFu = {fullCardNo:""};
				var jsonPayObj= angular.toJson(objFu);
				$state.go('sweepTheYard',{'jsonPayObj':jsonPayObj});
			};
			//卡余额查询
			if(dataType.attr("data-type")=="cardBalanceQuery"){
				$state.go('cardBalanceQuery');
			};
			//账单
			if(dataType.attr("data-type")=="billList"){
				$state.go('billList');
			};
			//转账
			if(dataType.attr("data-type")=="transfer"){
				$state.go('transfer');
			};
			//申请电子卡
			if(dataType.attr("data-type")=="applyCard"){
				$state.go('applyCard',{'josnObj':jsonObj});
			};
			//邀请码
			if(dataType.attr("data-type")=="inviteCode"){
				$state.go('inviteCode');
			};
			//设置支付密码
			if(dataType.attr("data-type")=="setPayPswd"){
				$state.go('setPayPswd',{'josnObj':jsonObj});
			};
			//水费电费燃气费
			if(dataType.attr("data-type")=="waterElectricityFuelGas"){
				//进入页面前 判断是否有缴费记录
				$scope.text=dataType.find("p").text();//缴费类型
				$scope.type=dataType.find("p").attr("data-type");//缴费类型 type
				var parms={};
				parms.customerNo=$scope.customerNo;//客户号
				$.ajax({
					url :getRootPath()+"/PayHydropowerSetupAction.findPayHydropowerSetupList.do?FAPView=JSON",
					type: 'post',
					data : parms,
					success : function(data) {
						var data=$.parseJSON(data);
						console.log(data)
						if(data.FAPStatus==0){
							if(data.success==true){//electricityFuelGas 没有缴费记录  paymentRecord 有过缴费记录
								//console.log(data.data.shuiList);
								if($scope.type=="1"){//水费
									if(data.data.shuiList.length==0){//没有记录的时候
										var waterObj = {text:$scope.text,type:$scope.type,phsid:$scope.type,message:"",city:"北京",ptdCardNo:""};
	    								var waterJsonObj= angular.toJson(waterObj);
										$state.go('jiaofeiRecord',{'waterJsonObj':waterJsonObj})
									}else{//有记录的时候
										$scope.list=data.data.shuiList;
										var waterObj = {list:$scope.list,text:$scope.text,type:$scope.type,phsid:$scope.type,message:"",city:"北京",ptdCardNo:$scope.ptdCardNo};
	    								var waterJsonObj= angular.toJson(waterObj);
										$state.go('waterElectricityFuelGas',{'waterJsonObj':waterJsonObj});	
									}
								}else if($scope.type=="2"){//电费
									if(data.data.dianList.length==0){
										var waterObj = {text:$scope.text,type:$scope.type,phsid:$scope.type,message:"",city:"北京",ptdCardNo:""};
	    								var waterJsonObj= angular.toJson(waterObj);
										$state.go('jiaofeiRecord',{'waterJsonObj':waterJsonObj})
									}else{
										$scope.list=data.data.dianList;
										var waterObj = {list:$scope.list,text:$scope.text,type:$scope.type,phsid:$scope.type,message:"",city:"北京",ptdCardNo:$scope.ptdCardNo};
	    								var waterJsonObj= angular.toJson(waterObj);
										$state.go('waterElectricityFuelGas',{'waterJsonObj':waterJsonObj});
									}
								}else if($scope.type=="3"){//燃气费
									if(data.data.meiList.length==0){
										var waterObj = {text:$scope.text,type:$scope.type,phsid:$scope.type,message:"",city:"北京",ptdCardNo:""};
	    								var waterJsonObj= angular.toJson(waterObj);
										$state.go('jiaofeiRecord',{'waterJsonObj':waterJsonObj})
									}else{
										$scope.list=data.data.meiList;
										var waterObj = {list:$scope.list,text:$scope.text,type:$scope.type,phsid:$scope.type,message:"",city:"北京",ptdCardNo:$scope.ptdCardNo};
	    								var waterJsonObj= angular.toJson(waterObj);
										$state.go('waterElectricityFuelGas',{'waterJsonObj':waterJsonObj});
									}
								}
							}else{
								$scope.msg = data.errors.msg;
								$scope.openModalThree();
								setTimeout(function(){
									$scope.closeModalThree();
								},1000*3);
							}
						}else if(data.FAPStatus==2){
							loginH5Host();//请重新登录
						}else{
							$scope.msg = data.FAPErrorMessage;
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
			};
			//手机充值
			if(dataType.attr("data-type")=="phoneRecharge"){
				$state.go('phoneRecharge',{'josnObj':jsonObj});
			};
			//申请信用卡
			if(dataType.attr("data-type")=="applyCreditCard"){
				$state.go('applyCreditCard');
			};
		}
	};
	//返回APP按钮 点击跳转
	$scope.goBackApp = function(){
		//alert("hjkhdjkgjh");
		function init(callback) {
		  var u = navigator.userAgent;
		  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		  //console.log('the phone is :'+isiOS)
		  if (!isiOS) {
		    if (window.WebViewJavascriptBridge) {
		      callback(WebViewJavascriptBridge)
		    } else {
		      document.addEventListener(
		        'WebViewJavascriptBridgeReady',
		        function() {
		          callback(WebViewJavascriptBridge)
		        },
		        false
		      );
		    }
		  } else {
		    if (window.WebViewJavascriptBridge) {
		      return callback(WebViewJavascriptBridge);
		    }
		    if (window.WVJBCallbacks) {
		      return window.WVJBCallbacks.push(callback);
		    }
		    window.WVJBCallbacks = [callback];
		    var WVJBIframe = document.createElement('iframe');
		    WVJBIframe.style.display = 'none';
		    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
		    document.documentElement.appendChild(WVJBIframe);
		    setTimeout(function() {
		      document.documentElement.removeChild(WVJBIframe)
		    }, 0)
		  }
		}
		function registerHandler(name, fun) {
		  init(function(bridge) {
		    bridge.registerHandler(name, fun);
		  })
		}
		function callHandler(name, data, fun) {
		  init(function(bridge) {
		    bridge.callHandler(name, data, fun);
		  })
		}
		var data = {
			"code":"00"
		};
		callHandler('goBack',data,function(res){

		})
	};
	//设置支付密码 弹框
	$ionicModal.fromTemplateUrl('templates/modalSix.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalSix = modal;
		//console.log($scope.modalSix)
		$scope.openModalSix = function() {
			$scope.modalSix.show();
		};
		$scope.closeModalSix = function() {
			$scope.modalSix.hide();
		};
		//判断支付密码是否为空
		if($scope.payPwd == ""){
			$scope.openModalSix();
			//点击取消按钮 关闭弹框
			$scope.closeSetPswd = function(){
				$scope.closeModalSix();
			}
			//点击确定按钮 去设置支付密码
			$scope.sureSetPswd = function(){
				$state.go('setPayPswd');
				$scope.closeModalSix();
			}
		}else{

		}
	});

	//弹框3
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
		.controller("homeCtrl",['$scope','$ionicHistory','$state','$stateParams','$ionicModal','$ionicLoading',homeCtrl]);



