function jiaofeiRecordCtrl($scope,$ionicListDelegate,$stateParams,$state,$ionicModal){
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
	$scope.ptdCardNo = queryParam.ptdCardNo;//有缴费记录的时候 缴费账号
	console.log("-----1 waterJsonObj----")
	console.log(queryParam); 

	$scope.maskContent=false;//如何知道缴费号码
	//水电燃气缴费初始化图片
	$(".waterElectricityFuelGas li").eq(0).find("i img").attr("src",imgRrc+"h5images/icon_jinru_black"+variable+".png");
	$(".waterElectricityFuelGas li").eq(1).find("i img").attr("src",imgRrc+"h5images/icon_life_hint"+variable+".png");
	$(".waterElectricityFuelGas div img").attr("src",imgRrc+"h5images/icon_life_position"+variable+".png");
	$(".add").attr("src",imgRrc+"h5images/add.png");

// 	//进入按钮
// 	//$("#waterElectricityFuelGas-view .item-content .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");
	//缴费记录
	$scope.goPaymentRecords = function(){
		$state.go('paymentRecords');
	}
	//如何知道缴费号码
	$scope.showMask=function(){
		$scope.maskContent=true;
	};
	$scope.close=function(){
		$scope.maskContent=false;
	};
	//判断进入页面有没有 缴费账号
	if($scope.ptdCardNo == ""){
		$(".paymentNum").val("");
	}else{
		$(".paymentNum").val($scope.ptdCardNo);
	}

	$(".goPayMoney").off("click").on("click",function(){//去缴费
		if($(".waterElectricityFuelGas label").text() == ""){
			$scope.msg = "请选择缴费单位";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}else{
			if($(".paymentNum").val() == ""){
				$scope.msg = "请输入正确缴费账号";
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}else{
				if($(this).css("opacity")=="1"){
					$scope.electric=function(url){
						var parms = {};
				 		parms.customerNo= $scope.customerNo;//客户号
				 		parms.sessionId = $scope.sessionId;//ID
				 		parms.cityName = $scope.city;//城市
				 		$.ajax({
				 			url :getRootPath()+url,
				 			type: 'post',
				 			data : parms,
				 			success : function(data) {
				 				var data=$.parseJSON(data);
				 				console.log("---初始化电费、水费、燃气费公司信息查询---");
				 				console.log(data);
				 				if(data.FAPStatus==0){
				 					if(data.success==true){
				 						if($scope.type=="1"){//水费
											$scope.company=data.data.WaterCompanyList;
											$scope.$apply();
				 						}else if($scope.type=="2"){//电费
											$scope.company=data.data.electricityFeesCompanyList;
											$scope.$apply();
				 						}else if($scope.type=="3"){//燃气费
											$scope.company=data.data.coalGasCompanyList;
											$scope.$apply();   
				 						}

										$scope.cityId = $scope.company[0].cityId;//城市ID
										$scope.cityName = $scope.company[0].cityName;//缴费城市
										$scope.companyName=$scope.company[0].companyName;//缴费单位
										$scope.companyNo=$scope.company[0].companyNo;//公司编号
										$scope.productType=$scope.company[0].productType;//产品类型
										$scope.provinceId=$scope.company[0].provinceId;//省id
										//看是否欠费 如果欠费就去缴费  不欠费弹框
										var parms={};
										var date = new Date();
										var year=date.getFullYear(); 
										var month=date.getMonth()+1;
										if(parseInt(month)<10){
											month="0"+month;
										}
										var yearmonth=year+month;
										parms.customerNo= $scope.customerNo;//客户号
										parms.sessionId = localStorage.getItem("data");//sessionId
										parms.account = $(".paymentNum").val();//缴费账号
										parms.yearmonth = yearmonth;//缴费日期
										parms.pid = $scope.provinceId;//省id
										parms.cid = $scope.cityId;//城市id
										parms.picoid = $scope.companyNo;//公司编号
										parms.protype = $scope.productType;//产品类型
										parms.truename = "";//用户名
										parms.cityName = $scope.cityName;//缴费城市
										console.log(parms);
										$.ajax({//生活缴费账单查询接口
		 									url :getRootPath()+"/EsaiAction.eSaiPubQuery.do?FAPView=JSON",
		 									type: 'post',
		 									data : parms,
		 									success : function(data) {
		 										var data=$.parseJSON(data);
		 										console.log("生活缴费账单查询接口")
		 										console.log(data)
		 										// var result = "k";
		 										if(data.FAPStatus==0){
		 											if(data.success==true){
		 												if(data.data.result=="f"){//不欠费
															$scope.msg = data.data.errmsg;
															$scope.openModalThree();
															setTimeout(function(){
																$scope.closeModalThree();
															},1000*4);									
		 												}else{//如果欠费 就去缴费
															//$scope.bills = fmoney(data.data.bills,2);//账户金额
															$scope.yearmonth =data.data.yearmonth.substr(0,4)+"-"+data.data.yearmonth.substr(4,2);//缴费账单日期
															$scope.paymentNum=data.data.account;//客户编号
															$scope.truename=data.data.truename;//用户名

		// 													//$scope.bills = "200.00元";//账户金额
		 													// $scope.yearmonth ="2017-02";//缴费账单日期
		 													// $scope.paymentNum="1234567890";//客户编号
		 													// $scope.truename="XXX";//用户名
		 													$scope.message = $scope.companyName;//缴费单位
		 													if($scope.type == "1"){
																var waterObj = {text:$scope.text,type:$scope.type,phsid:$scope.phsid,companyName:$scope.companyName,cid:$scope.cityId,pid:$scope.provinceId,picoid:$scope.companyNo,protype:$scope.productType,cityName:$scope.cityName,yearmonth:$scope.yearmonth,paymentNum:$scope.paymentNum,truename:$scope.truename};
													    		var waterJsonObj= angular.toJson(waterObj);
													    		console.log(waterJsonObj);
																$state.go('billingDetailsShui',{'waterJsonObj':waterJsonObj});
		 													}else if($scope.type == "2"){
																var waterObj = {text:$scope.text,type:$scope.type,phsid:$scope.phsid,companyName:$scope.companyName,cid:$scope.cityId,pid:$scope.provinceId,picoid:$scope.companyNo,protype:$scope.productType,cityName:$scope.cityName,yearmonth:$scope.yearmonth,paymentNum:$scope.paymentNum,truename:$scope.truename};
													    		var waterJsonObj= angular.toJson(waterObj);
																$state.go('billingDetailsDian',{'waterJsonObj':waterJsonObj});
															}else if($scope.type == "3"){
																var waterObj = {text:$scope.text,type:$scope.type,phsid:$scope.phsid,companyName:$scope.companyName,cid:$scope.cityId,pid:$scope.provinceId,picoid:$scope.companyNo,protype:$scope.productType,cityName:$scope.cityName,yearmonth:$scope.yearmonth,paymentNum:$scope.paymentNum,truename:$scope.truename};
													    		var waterJsonObj= angular.toJson(waterObj);
																$state.go('billingDetailsRan',{'waterJsonObj':waterJsonObj});
															}
		 												}
		 											}else{//访问失败
														$scope.msg = data.errors.msg;
														$scope.openModalThree();
														setTimeout(function(){
															$scope.closeModalThree();
														},1000*3);
		 											}
		 										}else if(data.FAPStatus==2){
		// 											//$scope.showMessage=false;//缴费信息初始化不显示
													loginH5Host();//请重新登录
		// 											//$state.go('waterElectricityFuelGas',{'josnObj':jsonObj,'waterJsonObj':waterJsonObj});
		 										}else{
													$scope.showMessage=false;//缴费信息初始化不显示
													$scope.msg = data.FAPErrorMessage;
													$scope.openModalThree();
													setTimeout(function(){
														$scope.closeModalThree();
													},1000*3);

		// 											$state.go('waterElectricityFuelGas',{'josnObj':jsonObj,'waterJsonObj':waterJsonObj});
		 										}
		 									},
		 									error:function(a,b,c){
		 							//				alert("错误");
		 									}					
	 									});
										
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
									},1000*3)
								}
								
				 			},
				 			error:function(a,b,c){
				 					alert("错误");
				 			}					
				 		});
					}

					////
					//调水电煤 接口
					if($scope.type=="1"){//水费
						$scope.electric("/WaterCompanyAction.findWaterCompanyDataList.do?FAPView=JSON");
					}else if($scope.type=="2"){//电费
						$scope.electric("/ElectricityFeesCompanyAction.findElectricityFeesCompanyDataList.do?FAPView=JSON");
					}else{//燃气费
						$scope.electric("/CoalGasCompanyAction.findCoalgascompanyDataList.do?FAPView=JSON");
					}
					////
				}else{
					$scope.msg = "缴费号码格式错误！";
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			}
		}
	});
	

	
	//点击跳转至缴费单位列表
	$scope.institutionsList=function(){
	    var waterObj={phsid:$scope.phsid,text:$scope.text,type:$scope.type,city:$scope.city,message:$scope.message};
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
		.controller("jiaofeiRecordCtrl",['$scope','$ionicListDelegate','$stateParams','$state','$ionicModal',jiaofeiRecordCtrl]);