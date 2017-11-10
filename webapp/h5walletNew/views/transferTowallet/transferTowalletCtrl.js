function transferTowalletCtrl($scope,$ionicModal){
	//$ionicLoading.show();//显示加载指示器
		// 转账页面
		$("#transferTowallet-view .transferTowallet_One .transferTowallet .rechargeNum").css("background-image","url("+imgRrc+"h5images/icon_zhuanqszh_tel"+variable+".png)");
		$("#transferTowallet-view .transferTowallet_Two .transferTowallet .rechargeMoney").css("background-image","url("+imgRrc+"h5images/icon_zhuannext_money"+variable+".png)");
		$("#transferTowallet-view .transferTowallet_Two .transferTowallet .rechargeText").css("background-image","url("+imgRrc+"h5images/icon_zhuanzh_warm"+variable+".png)");
		$("#transferTowallet-view .transferTowallet_Three .p2 span").css("background-image","url("+imgRrc+"h5images/icon_zhuannext_money_w"+variable+".png)");
		$("#transferDetails-view .recePerson .p3 span").css("background-image","url("+imgRrc+"h5images/zhuanzhang"+variable+".png)");
		$("#transferRecord-view .month_box .icomImg").css({"background-image":"url("+imgRrc+"h5images/icon_zhuanzhang"+variable+".png)","opacity":"50%"});
		//交易失败 图片
		$("#transferRecord-view .month_box .icomImgFailure").css("background-image","url("+imgRrc+"h5images/icon_zhuanzhang"+variable+".png)");
		$("#transferRecord-view .transferRecordNone img").attr("src",imgRrc+"h5images/icon_wujilu"+variable+".png");
};
angular.module("myapp")
		.controller("transferTowalletCtrl",['$scope','$ionicModal',transferTowalletCtrl]);