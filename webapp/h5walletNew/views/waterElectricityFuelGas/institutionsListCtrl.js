function institutionsListCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.certNo=localStorage.getItem("certNoData");//身份证号
	$scope.customerNameCN=localStorage.getItem("customerNameData");//姓名
	$scope.mobileNo=localStorage.getItem("mobileData");//手机号

	var queryParam = angular.fromJson($stateParams.waterJsonObj);
	$scope.text=queryParam.text;//名字
	$scope.type=queryParam.type;//缴费类型 1 水费  2 电费  3 燃气费
	$scope.phsid = queryParam.phsid;//
	$scope.city = queryParam.city;//缴费地区
	$scope.message = queryParam.message;//
	$("#institutionsList-view .noneImg").css("background-image","url("+imgRrc+"h5images/icon_wujilu"+variable+".png)");
	$scope.electric=function(url){
		//初始化电费、水费、燃气费公司信息查询
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
				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if($scope.type=="1"){//水费
							if(data.data.WaterCompanyList == 0){
								$scope.isHideImg = true;//显示无记录图片
							}else{
								$scope.isHideImg = false;
								$scope.companyList=data.data.WaterCompanyList;
								$scope.$apply();
							}
							
						}else if($scope.type=="2"){//电费
							if(data.data.electricityFeesCompanyList == 0){
								$scope.isHideImg = true;
							}else{
								$scope.isHideImg = false;
								$scope.companyList=data.data.electricityFeesCompanyList;
								$scope.$apply();
							}
						}else{//燃气费
							if(data.data.coalGasCompanyList == 0){
								$scope.isHideImg = true;
							}else{
								$scope.isHideImg = false;
								$scope.companyList=data.data.coalGasCompanyList;
								$scope.$apply();  
							}	 
						}
						//点击选择公司查询信息返回缴费页面
						$scope.waterElectricityFuelGas=function($event){
							var jsonObj= angular.toJson(queryParam);
							var message=$event.target.innerHTML;
							console.log(message);
							var waterObj={phsid:$scope.phsid,text:$scope.text,type:$scope.type,message:message,city:$scope.city}
							var waterJsonObj= angular.toJson(waterObj);
							$state.go('jiaofeiRecord',{'waterJsonObj':waterJsonObj});
						};
					}else{
						//alert(data.errors.msg);
						$scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					}
				}else if(data.FAPStatus==2){
					loginH5Host();
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
	//				alert("错误");
			}					
		});
	};
	if($scope.type=="1"){//水费
		$scope.electric("/WaterCompanyAction.findWaterCompanyDataList.do?FAPView=JSON");
	}else if($scope.type=="2"){//电费
		$scope.electric("/ElectricityFeesCompanyAction.findElectricityFeesCompanyDataList.do?FAPView=JSON");
	}else{//燃气费
		$scope.electric("/CoalGasCompanyAction.findCoalgascompanyDataList.do?FAPView=JSON");
	}

	// 弹框
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
		.controller("institutionsListCtrl",['$scope','$stateParams','$state','$ionicModal',institutionsListCtrl]);

