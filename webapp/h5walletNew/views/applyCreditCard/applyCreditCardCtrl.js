function applyCreditCardCtrl($http,$scope,$state,$sce,$ionicModal){
	//$ionicLoading.show();//显示加载指示器
	// 申请信用卡 页面
	$("#applyCreditCard-view .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");
	$("#applyCreditCard-view .list .item .img01").css("background-image","url("+imgRrc+"h5images/icon_bank_zggsyh"+variable+".png)");
	$("#applyCreditCard-view .list .item .img02").css("background-image","url("+imgRrc+"h5images/icon_bank_zggdyh"+variable+".png)");
	$("#applyCreditCard-view .list .item .img03").css("background-image","url("+imgRrc+"h5images/icon_bank_payh"+variable+".png)");
	$("#applyCreditCard-view .list .item .img04").css("background-image","url("+imgRrc+"h5images/icon_bank_pfyh"+variable+".png)");
	$("#applyCreditCard-view .list .item .img05").css("background-image","url("+imgRrc+"h5images/icon_bank_xyyh"+variable+".png)");
	//跳转到工商银行
	$scope.goGongShangBank = function(){
		$state.go('GongShangBank');
	}
	//工商银行信用卡 iframe
	$scope.paySrcGongShang = $sce.trustAsResourceUrl('https://mims.icbc.com.cn/IMServiceServer/servlet/ICBCBaseReqNSServlet?dse_operationName=ApplyCreditCardOp&coreCode=HZDW000007461&paraPromoCode=EW888020000070014700');

	//跳转到光大银行
	$scope.goGuangDaBank = function(){
		$state.go('guangDaBank');
	}
	//光大银行信用卡 iframe
	$scope.paySrcGuangDa = $sce.trustAsResourceUrl('https://xyk.cebbank.com/cebmms/apply/ps/card-list.htm?level=124&pro_code=FHTG023524SJ303XMRO');

	//跳转到平安银行
	$scope.goPingAnBank = function(){
		$state.go('pingAnBank');
	}
	//平安银行信用卡 iframe
	$scope.paySrcPingAn = $sce.trustAsResourceUrl('https://c.pingan.com/apply/mobile/apply/index.html?scc=230000588&ccp=1a2a3a4a8a13a9&showt=1&xl=01a02a03a04a05');

	//跳转到浦发银行
	$scope.goPuFaBank = function(){
		$state.go('puFaBank');
	}
	//浦发银行信用卡 iframe
	$scope.paySrcPuFa = $sce.trustAsResourceUrl('https://ecentre.spdbccc.com.cn/creditcard/indexActivity.htm?data=P1479932');

	//跳转到兴业银行
	$scope.goXingYeBank = function(){
		$state.go('xingYeBank');
	}
	//兴业银行信用卡 iframe
	$scope.paySrcXingYe = $sce.trustAsResourceUrl('https://ccshop.cib.com.cn:8010/application/cardapp/cappl/ApplyCard/toSelectCard?id=265d3950fd8c4ec59bdea5ee98bdd35c');
};
angular.module("myapp")
		.controller("applyCreditCardCtrl",['$http','$scope','$state','$sce','$ionicModal',applyCreditCardCtrl]);