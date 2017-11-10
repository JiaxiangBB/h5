function sweepTheYardCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");	
	$scope.customerNameCN=localStorage.getItem("customerNameData");//名字
	$scope.mobile=localStorage.getItem("mobileData");//手机号
	$scope.certNo=localStorage.getItem("certNoData");//身份证号
	var jsonPayObjParam = angular.fromJson($stateParams.jsonPayObj);
	$scope.fullCardNo = jsonPayObjParam.fullCardNo;//首页传过来空的 全时通卡卡号
	// var cardNo;
	console.log(jsonPayObjParam)
	if($scope.fullCardNo == ""){
		$(".bottom p").html("使用全时钱包 付款 <span>更换</span>");	
	}else{
		$scope.fullCardNo = jsonPayObjParam.fullCardNo;
		$(".bottom p").html("使用全时通卡 ("+$scope.fullCardNo.substr($scope.fullCardNo.length-4)+") 付款 <span>更换</span>");
	}
	//$ionicLoading.show();//显示加载指示器
	$("#sweepTheYard-view dl").eq(0).find("dt img").attr("src",imgRrc+"h5images/icon_home_fukuancode"+variable+".png");
	$("#sweepTheYard-view dl").eq(1).find("dt img").attr("src",imgRrc+"h5images/icon_home_saoyisao"+variable+".png");
	/*$("#sweepTheYard-view .codeOne img").attr("src",imgRrc+"h5images/icon_home_fukuancode"+variable+".png");
	$("#sweepTheYard-view .codeTwo img").attr("src",imgRrc+"h5images/icon_home_saoyisao"+variable+".png");*/

	$scope.dataType="7";//银行卡、信用卡 不可用
	$scope.money="0.01";
	$scope.payType="0";//扫码付
	//设置头部样式
	/*$(".nav-back").css("cssText","color:#fff !important");
	$(".bar .button.back-button").css("cssText","background: none !important");
	$(".bar .buttons span").css("cssText","color: #fff !important");
	$(".bar .title").css("cssText","color: #fff !important");
	$(".bar-header").css("cssText","background: -webkit-linear-gradient(left,#352e79, #2c2766, #372f89) !important;background: -o-linear-gradient(left,#352e79, #2c2766, #372f89) !important;background: -moz-linear-gradient(left,#352e79, #2c2766, #372f89) !important;background: linear-gradient(to right,#352e79, #2c2766, #372f89) !important;");*/
	
	//获取付款码信息事件  ScanCodeAction.qrcode  @"qrKey" @"cardNo" @"custerNo"
	var parms={};
	parms.custerNo=$scope.customerNo;
	parms.cardNo=$scope.fullCardNo;
	if($(".bottom p").attr("data-type")=="0"){//全时钱包余额
		parms.qrKey="17";
	}else{//全时通卡 需要卡号
		parms.qrKey="02";
	}
	
	$.ajax({
		url :getRootPath()+"/ScanCodeAction.qrcode.do?FAPView=JSON",
		type: 'post',
		data : parms,
		success : function(data) {
			var data=$.parseJSON(data);
			console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					var qrCode=data.data.qrCode;
					$scope.order(qrCode);
					$('#qr_container').qrcode({render:"canvas",correctLevel:0,text:qrCode});//二维码
					$("#imgcode").JsBarcode(qrCode);//条形码
					$scope.qrCode=qrCode.substr(0,4)+" "+qrCode.substr(4,4)+" "+qrCode.substr(8,4)+" "+qrCode.substr(11,4)+" "+qrCode.substr(14);
				}else{
					$scope.msg = data.errors.msg;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			}else if(data.FAPStatus==2){
				loginH5Host();
			}else{
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
	//轮询支付结果事件  PublicPayAction.queryOrderDetail  @"customerNo" @"sessionId" @"qrCode"
	$scope.order=function(qrCode){
		var parms={};
		parms.customerNo=$scope.customerNo;
		parms.sessionId=$scope.sessionId;
		parms.qrCode=qrCode;
		$.ajax({
			url :getRootPath()+"/PublicPayAction.queryOrderDetail.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						
					}else{
						$scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					}
				}else if(data.FAPStatus==2){
					loginH5Host();
				}else{
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

	//选择支付方式
	$scope.sweepPayWay=function(){
		var obj = {dataType:$scope.dataType,money:$scope.money,payType:$scope.payType,fullCardNo:$scope.fullCardNo};
	    var jsonObj= angular.toJson(obj);
		$state.go("sweepPayWay",{josnObj:jsonObj});
	};

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
		.controller("sweepTheYardCtrl",['$scope','$stateParams','$state','$ionicModal',sweepTheYardCtrl]);