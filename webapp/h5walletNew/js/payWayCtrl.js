function payWayCtrl($scope,$ionicHistory,$state,$stateParams,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.customerNameCN=localStorage.getItem("customerNameData");//名字
	$scope.mobile=localStorage.getItem("mobileData");//手机号
	$scope.certNo=localStorage.getItem("certNoData");//身份证号

	//获取参数
	var queryParam = angular.fromJson($stateParams.josnObj);
	$scope.dataType=queryParam.dataType;//判断是否支持此支付方式
	$scope.money=queryParam.money;//支付金额
	$scope.payType=queryParam.payType;//判断从哪个功能进入支付方式

	//获取URL全时通卡卡号
	$scope.fullCardNo = queryParam.fullCardNo;
	$scope.bankCardType = queryParam.bankCardType;
	
	console.log(queryParam);

	//支付方式图标
	$(".payWay li i img").attr("src",imgRrc+"h5images/icon_jinru_black"+variable+".png");
	//初始化支付方式
	var parm = {};
	parm.customerNo = $scope.customerNo;//客户号
	$.ajax({
		url :getRootPath()+"/PrepaidCardAction.cardQuery.do?FAPView=JSON",
		type: 'post',
		data : parm,
		success : function(data) {
			var data=$.parseJSON(data);
			//console.log(data);
			var bankcard_list = data.data.bankcard;//储蓄卡和信用卡
			var cdcard_list = data.data.cdcard;//全时通卡
			if(data.FAPStatus==0){
				if(data.success==true){
					//初始化银行卡
					if(bankcard_list.length>0){
						for(var i=0;i<bankcard_list.length;i++){
							var BANKTYPE = bankcard_list[i].BANKTYPE; //银行卡类型
							var bankcardNo = bankcard_list[i].ACCOUNTNO;//卡号
							var BANKNAME = bankcard_list[i].BANKNAME;
							var img="",bankCardType,other,style;
							img=bankCard(BANKNAME,img);

							if(BANKTYPE=="0"){
								bankCardType="储蓄卡";
								other='';
								style='';
								$(".payWay ul").prepend('<li class="saoMaFu" data-type="2">'
									+'<span><img src="'+img+'"></span>'
									+'<p '+style+'>'+BANKNAME+bankCardType+'(尾号'+bankcardNo.substr(bankcardNo.length-4)+')'+other+'</p>'
									+'<i><img src="'+imgRrc+'h5images/icon_jinru_black'+variable+'.png"></i>'
									+'<b style="display:none">'+bankcardNo+'<b/>'
								+'</li>');
							}else{
								bankCardType="信用卡";
								other='<br>此交易不支持使用信用卡';
								style='style="margin-top: 0.09rem"';
								$(".payWay ul").prepend('<li class="balance all saoMaFu" data-type="3">'
									+'<span><img src="'+img+'"></span>'
									+'<p '+style+'>'+BANKNAME+bankCardType+'(尾号'+bankcardNo.substr(bankcardNo.length-4)+')'+other+'</p>'
									+'<i><img src="'+imgRrc+'h5images/icon_jinru_black'+variable+'.png"></i>'
									+'<b class="bankCardHao" style="display:none">'+bankcardNo+'<b/>'
								+'</li>');
							}
						}
					}
					//初始化全时通卡
					if(cdcard_list.length>0){
						for(var i=0;i<cdcard_list.length;i++){
							var BALANCE = cdcard_list[i].BALANCE; //余额
							var CARDNO = cdcard_list[i].CARDNO;//卡号
							$(".payWay ul").prepend('<li  class="balance all BALANCE'+i+'" data-type="1">'
								+'<span><img src="'+imgRrc+'h5images/icon_jinegai_yellow'+variable+'.png"></span>'
								+'<p>全时通卡尾号('+CARDNO.substr(CARDNO.length-4)+')<br>余额('+fmoney(BALANCE,2)+')元</p>'
								+'<i><img src="'+imgRrc+'h5images/icon_jinru_black'+variable+'.png"></i>'
								+'<b class="fullCardHao" style="display:none">'+CARDNO+'<b/>'
							+'</li>');
							if($scope.money>BALANCE){
								$(".BALANCE"+i+"").css("opacity","0.4");
							}
						}
					}
					//初始全时钱包
					$(".payWay ul").prepend('<li class="all avabalance" data-type="0">'
						+'<span><img src="'+imgRrc+'h5images/icon_qstcard_yue'+variable+'.png"></span>'
						+'<p>账户余额('+fmoney(data.data.avabalance,2)+')元</p>'
						+'<i><img src="'+imgRrc+'h5images/icon_jinru_black'+variable+'.png"></i>'
						+'<b style="display:none"><b/>'
					+'</li>');
					//判断是否支持此支付方式
					for(var i=0;i<$(".payWay ul li").length;i++){
						var datatype=$(".payWay ul li").eq(i).attr("data-type");
						if($scope.dataType==datatype){
							$(".payWay ul li").eq(i).css("opacity","0.4");
						}
					}
					if($scope.dataType=="4"){//信用卡和全时通卡均不可用
						$(".balance").css("opacity","0.4");
					}
					if($scope.dataType=="5"){//余额、全时通卡、信用卡均不可用
						$(".all").css("opacity","0.4");
					}
					if($scope.dataType=="7"){//银行卡、信用卡均不可用
						$(".saoMaFu").css("opacity","0.4");
					}
					//判断支付金额
					if($scope.money>data.data.avabalance){
						$(".avabalance").css("opacity","0.4");
					}
					$(".payWay ul li").off("click").live("click",function(){
						var _t=$(this),payObj;
						//判断支付方式
						if(_t.find("b").text()==""){//全时钱包付款
							$scope.paytype="01";
						}else{//银行卡付款
							$scope.paytype="26";
						}

						if(queryParam.orderno){

							var orderno=queryParam.orderno,amount=queryParam.amount;//申请电子卡订单号和面额
							payObj={customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobile,certNo:$scope.certNo,cardNo:_t.find(".bankCardHao").text(),bankCardType:_t.find("p").text(),fullCardNo:$scope.fullCardNo,money:$scope.money,orderno:orderno,amount:amount};
						
						}else if(queryParam.phoneType=="1"){//手机充值所需参数

							var mobile=queryParam.mobile,//充值手机号
								sellPrice=queryParam.sellPrice,//缴费金额
								areaName=queryParam.areaName,//省份
								carrierName=queryParam.carrierName,//产品类别移动、联通、电信
								ppiId=queryParam.ppiId;//产品Id																			
								payObj={cardNo:_t.find("b").text(),bankCardType:_t.find("p").text(),money:sellPrice,mobile:mobile,sellPrice:$scope.money,areaName:areaName,carrierName:carrierName,ppiId:ppiId,payType:$scope.paytype};
								console.log(payObj)
						}else if(queryParam.phoneType=="2"){//手机流量充值所需参数
							payObj={mobilePhone:queryParam.mobilePhone,type:queryParam.type,cardNo:_t.find("b").text(),bankCardType:_t.find("p").text(),money:queryParam.moneyFlow,productId:queryParam.ppiId,flow:queryParam.flow,payType:$scope.paytype};
							console.log(payObj)
						}else if(queryParam.receiverName){//生活缴费 公共事业单位名称
						
							//console.log(queryParam)
							payObj={certNo:$scope.certNo,cardNo:_t.find("b").text(),bankCardType:_t.find("p").text(),money:$scope.money,};
						
						}else if($scope.dataType =="7"&$scope.payType =="0"){//返回 扫码付款码 全时通卡 卡号
							
							payObj={dataType:$scope.dataType,money:$scope.money,payType:$scope.payType,fullCardNo:_t.find("b").text()};
							//console.log(payObj)
						}else{

							payObj={customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobile,certNo:$scope.certNo,cardNo:_t.find(".bankCardHao").text(),bankCardType:_t.find("p").text(),fullCardNo:$scope.fullCardNo,money:$scope.money};//卡号和支付金额
						
						}
						$scope.payWay(_t,payObj);
					});
				}else{
					alert(data.errors.msg);
				}
			}else if(data.FAPStatus==2){
				loginH5Host();
			}else{
				alert(data.FAPErrorMessage);
			}
		},error:function(){
			//alert("错误");
		}
	});
	//点击支付方式
	$scope.payWay=function(_t,payObj){
		var obj = {certNo:$scope.certNo,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobile};
	    var jsonObj= angular.toJson(obj);
	    var jsonPayObj = angular.toJson(payObj);//返回上一级页面传的参数
		if(_t.css("opacity")==1){
			if(_t.attr("data-type")!="6"){
				if($scope.payType=="0"){//付款码
					$state.go('sweepTheYard',{'jsonPayObj':jsonPayObj});
					
				}else if($scope.payType=="1"){//申请电子卡
					$state.go('applyPayPassword',{'josnObj':jsonObj,'jsonPayObj':jsonPayObj});
				}else if($scope.payType=="2"){//余额充值
					var accountObj = {customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo};
					var jsonAccountObj= angular.toJson(accountObj);
					$ionicHistory.clearCache();
					$state.go('bankPhoneCode',{'jsonAccountObj':jsonAccountObj,'jsonPayObj':jsonPayObj});
				}else if($scope.payType=="3"){//全时通卡充值
					$ionicHistory.clearCache();
					console.log(jsonPayObj);
					$state.go('rechfullTimeCard',{'josnObj':jsonPayObj});
				}else if($scope.payType=="4"){//水电燃气
					
					var obj =  angular.fromJson($stateParams.josnObj);
	    			var jsonObj= angular.toJson(obj);
	    			console.log(jsonObj);
					// var obj = {certNo:$scope.certNo,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobile,money:$scope.money,dataType:"4",payType:"4",areaName:queryParam.address,receiverName:queryParam.message,userNo:lifeParam.paymentNum,itemName:queryParam.text,picoid:queryParam.picoid,pid:queryParam.pid,cid:queryParam.cid,truename:lifeParam.truename,protype:queryParam.protype,phsid:queryParam.phsid};
					//判断支付方式
					if(_t.find("b").text()==""){//全时钱包付款
						$state.go('paymentPassword',{'josnObj':jsonObj,'jsonPayObj':jsonPayObj});
					}else{//银行卡付款
						$state.go('paymentMessage',{'josnObj':jsonObj,'jsonPayObj':jsonPayObj});
					}
				}else if($scope.payType=="5"){//手机充值
					if(queryParam.phoneType=="1"){//手机话费充值
						//判断支付方式
						if(_t.find("b").text()==""){//全时钱包付款
							$state.go('payPassword',{'josnObj':jsonObj,'jsonPayObj':jsonPayObj});
						}else{//银行卡付款
							$state.go('payMessage',{'josnObj':jsonObj,'jsonPayObj':jsonPayObj});
						}
					}else if(queryParam.phoneType=="2"){//手机流量充值
						//判断支付方式
						if(_t.find("b").text()==""){//全时钱包付款
							$state.go('payPasswordFlow',{'jsonPayObj':jsonPayObj});
							console.log(jsonPayObj)
						}else{//银行卡付款
							$state.go('payMessageFlow',{'jsonPayObj':jsonPayObj});
							console.log(jsonPayObj)
						}
					}
					
					
				}
			}else{
				$state.go('addBank',{'josnObj':jsonObj});
			}
		}
	};
};
angular.module("myapp")
		.controller("payWayCtrl",['$scope','$ionicHistory','$state','$stateParams','$ionicModal',payWayCtrl]);