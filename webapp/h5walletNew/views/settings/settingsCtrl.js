function settingsCtrl($scope,$ionicHistory,$state,$stateParams,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.certType =localStorage.getItem("trueNameStatusData"); //判断身份证号
	//$ionicLoading.show();//显示加载指示器
	$(".homeFooter p img").attr("src",imgRrc+"h5images/icon-rukou-logo"+variable+".png");

	//设置页面
	$("#settings-view .headPortrait img").attr("src",imgRrc+"h5images/icon_head_image"+variable+".png");
	// $("#settings-view .mobileNumber .realName").css("background-image","url("+imgRrc+"h5images/Artboard"+variable+".png)")
	$("#settings-view .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");
	$("#settings-view .passwordSet img").attr("src",imgRrc+"h5images/icon_mimaguanli"+variable+".png");
	$("#settings-view .customerSer img").attr("src",imgRrc+"h5images/icon_kefu"+variable+".png");
	//常见问题图标
	$("#settings-view .comProblems img").attr("src",imgRrc+"h5images/changjianwenti"+variable+".png");
	//$("#settings-view .comProblems .img").attr("src",imgRrc+"h5images/icon_kefu"+variable+".png");
	
	//个人信息 设置页面
	$("#settings-view .headPortrait img").attr("src",imgRrc+"h5images/icon_head_image"+variable+".png")
	$("#settings-view .mobileNumber .realName").css("background-image","url("+imgRrc+"h5images/Artboard"+variable+".png)")
	$("#settings-view .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");
	$("#settings-view .passwordSet img").attr("src",imgRrc+"h5images/icon_mimaguanli"+variable+".png");
	$("#settings-view .customerSer img").attr("src",imgRrc+"h5images/icon_kefu"+variable+".png");
	
	//获取url中的参数信息
	var queryParam = angular.fromJson($stateParams.jsonObj);
	$scope.mobileNo = queryParam.mobileNo;//手机号
	$scope.customerNameCN = queryParam.customerNameCN;
	$scope.certNo = queryParam.certNo;
	//console.log($scope.certType);
	//截取手机号中间4位
	//var mobileNo = $stateParams.mobileNo.substring(3,$stateParams.mobileNo.length-4);
	//console.log(mobileNo);
	//$scope.mobileNo = $stateParams.mobileNo.substr(0,3)+mobileNo.replace(mobileNo,"****")+$stateParams.mobileNo.substr($stateParams.mobileNo.length-4,4);//手机号
	//$scope.mobileNo = $stateParams.mobileNo
	//$scope.certNo = $stateParams.certNo;//身份证
	console.log($scope.certType);
	console.log($scope.customerNameCN);
	//console.log($scope.mobileNo);

	var obj = {certType:$scope.certType,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobileNo,certNo:$scope.certNo};
	var jsonObj= angular.toJson(obj);
	//console.log(jsonObj);
	if ($scope.certType == 0) {
		$(".mobileNumber .realName").css("background-image","url("+imgRrc+"h5images/Artboard"+variable+".png)");
		$("#settings-view .authentication").off("click").on("click",function(){
			$state.go('realNameAuth');
		})
	}else if ($scope.certType == 1) {
		$(".mobileNumber .realName").css("background-image","none").text($scope.customerNameCN);
		$("#settings-view .authentication").off("click").on("click",function(){
			$state.go('personalInfor',{'jsonObj':jsonObj});
		})
	}

	//跳转到密码管理
	$("#settings-view .passwordSetting").off("click").on("click",function(){
		$state.go('passwordSet',{'jsonObj':jsonObj});
	});

	//跳转到常见问题
	$("#settings-view .commonProblems").off("click").on("click",function(){
		$state.go('comProblems');
	});
};
angular.module("myapp")
		.controller("settingsCtrl",['$scope','$ionicHistory','$state','$stateParams','$ionicModal',settingsCtrl]);