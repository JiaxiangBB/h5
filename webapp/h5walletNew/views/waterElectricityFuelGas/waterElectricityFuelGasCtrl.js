function waterElectricityFuelGasCtrl($scope,$ionicListDelegate,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");//sessionId
	$scope.certNo=localStorage.getItem("certNoData");//身份证号
	$scope.customerNameCN=localStorage.getItem("customerNameData");//姓名
	$scope.mobileNo=localStorage.getItem("mobileData");//手机号

	var queryParam = angular.fromJson($stateParams.waterJsonObj);
	$scope.text=queryParam.text;//缴费产品 水、电、燃气
	$scope.type=queryParam.type;//缴费类型 1 水费  2 电费  3 燃气费
	$scope.phsid =queryParam.phsid;//缴费项目Id
	$scope.message = queryParam.message;//判断缴费单位 默认 还是 点击返回的
	$scope.city = queryParam.city;//判断城市 默认 还是 点击返回的
	$scope.list = queryParam.list;//有缴费记录的数据
	$scope.ptdCardNo = queryParam.ptdCardNo;//缴费账号 空
	console.log("-----1 waterJsonObj----")
	console.log(queryParam);

	$scope.maskContent=false;//如何知道缴费号码
	$scope.electricityFuelGas=false;//没有缴费记录
	$scope.paymentRecord=false;//有缴费记录
	//水电燃气缴费初始化图片
	$(".waterElectricityFuelGas li").eq(0).find("i img").attr("src",imgRrc+"h5images/icon_jinru_black"+variable+".png");
	$(".waterElectricityFuelGas li").eq(1).find("i img").attr("src",imgRrc+"h5images/icon_life_hint"+variable+".png");
	$(".waterElectricityFuelGas div img").attr("src",imgRrc+"h5images/icon_life_position"+variable+".png");
	$(".add").attr("src",imgRrc+"h5images/add.png");

	//进入按钮
	//$("#waterElectricityFuelGas-view .item-content .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");

	//如何知道缴费号码
	$scope.showMask=function(){
		$scope.maskContent=true;
	};
	$scope.close=function(){
		$scope.maskContent=false;
	};
	//缴费记录
	$scope.goPaymentRecords = function(){
		$state.go('paymentRecords');
	}
	//点击添加账号缴费
	$scope.addPayment=function(){
		//$(".paymentNum").val("");
		var waterObj = {text:$scope.text,type:$scope.type,phsid:$scope.type,message:"",city:"北京"};
		var waterJsonObj= angular.toJson(waterObj);
		$state.go('jiaofeiRecord',{'waterJsonObj':waterJsonObj})
	};
	//缴费账户图标
	if($scope.type=="1"){//水费
		$(".account").attr("src",imgRrc+"h5images/icon_life_water24"+variable+".png");
	}else if($scope.type=="2"){//电费
		$(".account").attr("src",imgRrc+"h5images/icon_life_electric24"+variable+".png");
	}else if($scope.type=="3"){//燃气费
		$(".account").attr("src",imgRrc+"h5images/icon_life_fire24"+variable+".png");
	}

	//左滑 删除水费记录
	$scope.onItemDeleteShui = function(item) {	
		// console.log(item)
		$scope.ptdCustomerNo = item.ptdCustomerNo;
		$scope.ptdId = item.ptdId;
		// console.log($scope.ptdCustomerNo);
		// console.log($scope.ptdId)
		var parms={};
		parms.ptdCustomerNo=$scope.ptdCustomerNo;//用户编号
 		parms.ptdId=$scope.ptdId; //记录的Id
 		$.ajax({
			url :getRootPath()+"/PayHydropowerAccDetailAction.deletePayHydropowerAccDetail.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				console.log(data)
				if(data.FAPStatus==0){
					if(data.success==true){
						$scope.list.splice($scope.list.indexOf(item), 1);
						$scope.msg = "缴费记录删除成功";
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
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
			},error:function(a,b,c){
//					alert("错误");
			}
 		});	
	};
	//再次缴费
	$scope.addPaymentAgain = function(item){
		$scope.receiverName= item.receiverName;//缴费单位
		$scope.ptdCardNo = item.ptdCardNo;//缴费账户
		console.log(item.receiverName);
		console.log(item.ptdCardNo);
		var waterObj = {text:$scope.text,type:$scope.type,phsid:$scope.type,message:$scope.receiverName,city:$scope.city,ptdCardNo:$scope.ptdCardNo};
		var waterJsonObj= angular.toJson(waterObj);
		$state.go('jiaofeiRecord',{'waterJsonObj':waterJsonObj})
	};
	//点击跳转至缴费单位列表
	$scope.institutionsList=function(){
	    var waterObj={phsid:$scope.phsid,text:$scope.text,type:$scope.type,city:$scope.city};
	    var waterJsonObj= angular.toJson(waterObj);
	    console.log(queryParam);
		$state.go('institutionsList',{'waterJsonObj':waterJsonObj})
	};
	//输入缴费编号
	$(".paymentNum").keyup(function(){
		if($(this).val().length==10){
			$(".billingDetails").css("opacity","1");
		}else{
			$(".billingDetails").css("opacity","0.4");
		}
	});
	//点击切换城市
	$scope.cityChangesFun = function(){
		var waterObj={phsid:$scope.phsid,text:$scope.text,type:$scope.type,city:$scope.city};
	    var waterJsonObj= angular.toJson(waterObj);
	    console.log(queryParam);
		$state.go('cityChanges',{'waterJsonObj':waterJsonObj})
	};

	//调用弹框
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
		.controller("waterElectricityFuelGasCtrl",['$scope','$ionicListDelegate','$stateParams','$state','$ionicModal',waterElectricityFuelGasCtrl]);