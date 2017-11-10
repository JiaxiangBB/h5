
/*--------------------------------------交易详情-------------------------------------------------*/
function detail($scope,$rootScope,$location,$state,$stateParams){
	//获取wrap页面的参数         
	//解析url参数     wrap页面    publicStr
	var obj="";
	var str = $stateParams.publicStr;
	if(str==""){
		
	}else{
		var privateStr=privateKey(str);
		obj=angular.fromJson(privateStr);
	}
   $scope.customerNo = obj.customerNo;
   $scope.sessionId = obj.sessionId; 
   $scope.mobile = obj.mobile;
   $scope.customerNameCN = obj.customerNameCN;
   $scope.payPwdFlag = obj.payPwdFlag;//是否设置支付密码
   $scope.password = obj.password;//登录密码
   $scope.lastLogonTime = obj.lastLogonTime;//最后一次登录时间
 //解析url参数    二级页面    moneyStr
   var mstr = $stateParams.moneyStr;
   var mprivateStr=privateKey(mstr);
   var mobj=angular.fromJson(mprivateStr);
   $scope.balance_wrap = mobj.balance_wrap;//转账页面显示 账户余额
   $scope.accountBalance = mobj.accountBalance;
   $scope.quanShiCard=mobj.quanShiCard;
 //解析url参数    二级页面    moneyStr
   var dstr=$stateParams.detailStr;
   var dprivateStr=privateKey(dstr);
   var dobj=angular.fromJson(dprivateStr);
   var createTime = dobj.createTime;
   var orderNo = dobj.orderNo;
   var trxAmount = dobj.trxAmount;
   var transactionType = dobj.transactionType;
   var merchName = dobj.merchName;
   var states = dobj.states;
   //定义全局变量
   var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
	var publicStr=publicKey(str);
	var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}'
	var moneyStr=publicKey(mstr);
	
	$scope.money=trxAmount;
	$scope.trade=states;
	$scope.time=createTime;
	$scope.num=orderNo;
	$scope.type=transactionType;
	$scope.message=merchName;
	
	$scope.back_trading=function(){
		$scope.totrading(publicStr,moneyStr)
	}
};
angular.module("myapp")
		.controller("detail",["$scope","$rootScope","$location","$state","$stateParams",detail]);