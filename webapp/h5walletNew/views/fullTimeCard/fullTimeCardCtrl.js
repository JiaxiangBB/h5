function fullTimeCardCtrl($scope,$ionicHistory,$state,$stateParams,$ionicModal){
	//$ionicLoading.show();//显示加载指示器
	//全时通卡余额
	$("#balanFullTimeCard-view .balanFullTimeCardImg").attr("src",imgRrc+"h5images/icon_qstcard_yue"+variable+".png")
	$("#rechfullTimeCard-view .rechfullTimeCard .rechargeNum").css("background-image","url("+imgRrc+"h5images/jine"+variable+".png)");
	
	$("#fullTimeCard-view .transDetail img").attr("src",imgRrc+"h5images/icon_kashu_qstcard"+variable+".png");
	$("#fullTimeCard-view .addFullCard").css("background-image","url("+imgRrc+"h5images/icon_addqstcard"+variable+".png)");
	$("#fullTimeCard-view .noneCard").css("background-image","url("+imgRrc+"h5images/icon_wuka"+variable+".png)");

	$scope.isApp = getURLParameter("isApp");//isApp
	//$(".cardList").html("");
	if($scope.isApp == "1"){//判断是否从APP端访问
		$scope.isAppFlag = true;
	}else{
		$scope.isAppFlag = false;
	}
	$scope.onFullCardBackFun = function(){//全时通卡 返回APP 
		var data = {
			"isApp":"1"
		}
		callHandler('onFullCardBackApp',data,function(res){

		})
	}
	//登录接口
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
	                    $scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
	                }
	            }else if(data.FAPStatus==2){
	                loginH5Host();
	            }else if(data.FAPStatus==1){
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

	$scope.init=function(){
		//公共参数
		$scope.customerNo=getURLParameter("customerNo");//
		$scope.sessionId=localStorage.getItem("data");
		//用户信息查询
		var parms = {};
		parms.customerNo = $scope.customerNo;
		parms.sessionId = $scope.sessionId;
		$.ajax({
			url :getRootPath()+"/CustomerAction.custInfoQuery.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				console.log(data.data);
				if(data.FAPStatus==0){
					if(data.success==true){
						var certNo=data.data.certNo;//身份证号
						//var certType=data.data.certType;//是否实名
						var customerNameCN=data.data.customerNameCN;//名字
						var mobileNo=data.data.mobileNo;//手机号
						//$scope.certType = certType ;//ui-sref传参数需要的 是否实名
						$scope.customerNameCN = customerNameCN;//名字
						$scope.mobileNo = mobileNo;//手机号
						$scope.certNo = certNo;//身份证号
						var obj = {certType:$scope.certType,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo};
						var jsonObj= angular.toJson(obj);
						console.log(jsonObj);
						//跳转到 添加全时通卡页面
						$scope.addFullCards = function(){
							$state.go('addFullCard',{'josnObj':jsonObj});
						};
						//列表方法调用
						$scope.cardListInit();
					}else{
						//alert(data.errors.msg);
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
	};

	//全时通卡列表页面 初始化数据
	$scope.cardListInit = function(){
		$scope.sessionId=localStorage.getItem("data");
		if(true){
			var parms = {};
			parms.customerNo = $scope.customerNo;//客户号
			parms.sessionId = $scope.sessionId;//令牌号
			parms.beginPos = 1;//起始位置
			parms.pageSize = 10;//页面记录数
			$.ajax({                    
				url :getRootPath()+"/AccountAction.preCardListQuery.do?FAPView=JSON",
				type: 'post',
				cache:false,
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							$scope.resultQshi = data.data.perPreCardInfList.result;
							$scope.$apply();
							//console.log($scope.resultQshi)
							if($scope.resultQshi.length == 0){
								$("#fullTimeCard-view .noneCard").css("display","block");
								$("#fullTimeCard-view .noneCardDetail").css("display","block");
							}else{
								//console.log($scope.resultQshi[0].aifavabalance);
								//console.log($scope.resultQshi[0].cardNo);
								$("#fullTimeCard-view .cardList").css("display","block");
								//循环显示全时通卡背景
								var i = 0;
								for (var j = 0; j < $scope.resultQshi.length; j++) {
									var cardNo = $scope.resultQshi[j].cardNo;//全时通卡卡号
									var intercept = cardNo.substr(6,9);
									var interceptCardno=cardNo.substr(0,6)+intercept.replace(intercept,"*********")+cardNo.substr(15,4);
									//显示金额样式
									$(".cardList").append('<li>'
										+'<p class="balanceNum"><b>'+fmoney($scope.resultQshi[j].aifavabalance,2)+'</b></p>'
										+'<p class="cardNum">'+interceptCardno+'</p>'
										+'<p class="cardNumberQshiNum" style="display: none;">'+cardNo+'</p>'
										+'</li>'
									);

									if(j>=3){
										i=1;
									}else{
										i++;
									}
									$("#fullTimeCard-view .cardList li").eq(j).css({"background-image":"url("+imgRrc+"h5images/ka"+(i)+variable+".png)","background-repeat":"no-repeat"});
									
									//点击每个卡 跳转到该卡的充值页面
									//console.log($("#fullTimeCard-view .cardList .fullCardLiTop").eq(j))
									$("#fullTimeCard-view .cardList li").off("click").live("click",function(){
										var aifavabalance=$(this).find(".balanceNum b").text();//卡余额
										var fullCardNo=$(this).find(".cardNumberQshiNum").text();//卡号
										var Obj = {aifavabalance:aifavabalance,fullCardNo:fullCardNo};
										// var CardObj = {cardNo:"",bankCardType:"",fullCardNo:fullCardNo,certNo:$scope.certNo,mobileNo:$scope.mobileNo,customerNameCN:$scope.customerNameCN};
										var josnObj= angular.toJson(Obj);
										console.log(fullCardNo);
										//$state.go('rechfullTimeCard',{'josnObj':fullCardObj});
										$state.go('balanFullTimeCard',{'josnObj':josnObj});
									})
								}
							}

						}else{
							//console.log("失败");
						}
					}else{
						//console.log("失败");
					}
					
				},
				error:function(a,b,c){
//					alert("错误");
				}					
			});
		}else{
		}	
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
		.controller("fullTimeCardCtrl",['$scope','$ionicHistory','$state','$stateParams','$ionicModal',fullTimeCardCtrl]);
