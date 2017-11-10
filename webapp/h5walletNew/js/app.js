/*
*主模块 程序的入口
 */

var myapp = angular.module("myapp",["ionic"]);

//配置路由
myapp.config(function($stateProvider,$urlRouterProvider){
	$stateProvider.state("home",{//主页面
		url:"/home",
		cache: false,//不缓存
		params: {'jsonObj': null},
		templateUrl:"views/home/home.html",
		controller:"homeCtrl"
	})
	.state("settings",{//设置页面
		url:"/settings?jsonObj",
		templateUrl:"views/settings/settings.html",
		controller:"settingsCtrl"
	})
	.state("realNameAuth",{//实名认证
		url:"/realNameAuth",
		templateUrl:"views/settings/realNameAuth.html",
		controller:"realNameAuthCtrl"
	})
	.state("personalInfor",{//个人信息
		url:"/personalInfor?jsonObj",
		cache:true,
		templateUrl:"views/settings/personalInfor.html",
		params: {'jsonObj': null},//这里设置为对象，用于接受对象型数据
		controller:"personalInforCtrl"
	})
	.state("passwordSet",{//密码管理
		url:"/passwordSet?jsonObj",
		templateUrl:"views/settings/passwordSet.html",
		params: {'jsonObj': null},
		controller:"passwordSetCtrl"
	})
	.state("changePayPass",{//修改支付密码
		url:"/changePayPass?jsonObj",
		templateUrl:"views/settings/changePayPass.html",
		controller:"changePayPassCtrl"
	})
	.state("findPayPass",{//找回支付密码
		url:"/findPayPass?jsonObj",
		templateUrl:"views/settings/findPayPass.html",
		params: {'jsonObj': null},
		controller:"findPayPassCtrl"
	})
	.state("comProblems",{//常见问题
		url:"/comProblems?jsonObj",
		templateUrl:"views/settings/comProblems.html",
		params: {'jsonObj': null},
		controller:"comProblemsCtrl"
	})
	.state("withdrawDeposit",{//常见问题--提现
		url:"/withdrawDeposit?jsonObj",
		templateUrl:"views/settings/comProblems-withdrawDeposit.html",
		params: {'jsonObj': null},
		controller:"comProblemsCtrl"
	})
	.state("registered",{//常见问题--注册
		url:"/registered?jsonObj",
		templateUrl:"views/settings/comProblems-registered.html",
		params: {'jsonObj': null},
		controller:"comProblemsCtrl"
	})
	.state("authentication",{//常见问题--实名认证
		url:"/authentication?jsonObj",
		templateUrl:"views/settings/comProblems-authentication.html",
		params: {'jsonObj': null},
		controller:"comProblemsCtrl"
	})
	.state("safe",{//常见问题--账户安全
		url:"/safe?jsonObj",
		templateUrl:"views/settings/comProblems-safe.html",
		params: {'jsonObj': null},
		controller:"comProblemsCtrl"
	})
	.state("comProblemsFullCard",{//常见问题--全时通卡
		url:"/comProblemsFullCard?jsonObj",
		templateUrl:"views/settings/comProblems-fullCard.html",
		params: {'jsonObj': null},
		controller:"comProblemsCtrl"
	})
	.state("comProblemsRecharge",{//常见问题--充值
		url:"/comProblemsRecharge?jsonObj",
		templateUrl:"views/settings/comProblems-recharge.html",
		params: {'jsonObj': null},
		controller:"comProblemsCtrl"
	})
	.state("comProblemsAddCard",{//常见问题--添加银行卡
		url:"/comProblemsAddCard?jsonObj",
		templateUrl:"views/settings/comProblems-addCard.html",
		params: {'jsonObj': null},
		controller:"comProblemsCtrl"
	})
	.state("comProblemsTransfer",{//常见问题--转账
		url:"/comProblemsTransfer?jsonObj",
		templateUrl:"views/settings/comProblems-transfer.html",
		params: {'jsonObj': null},
		controller:"comProblemsCtrl"
	})
	.state("accountBalance",{//账户余额
		url:"/accountBalance?jsonAccountObj&jsonPayObj",
		templateUrl:"views/accountBalance/accountBalance.html",
		controller:"accountBalanceCtrl"
	})
	.state("paymentMethod",{//选择付款方式
		url:"/paymentMethod?josnObj&fullMsgObj",
		templateUrl:"views/accountBalance/paymentMethod.html",
		controller:"payWayCtrl"
	})
	.state("bankPhoneCode",{//付款方式
		url:"/bankPhoneCode?jsonAccountObj&jsonPayObj",
		templateUrl:"views/accountBalance/bankPhoneCode.html",
		params: {'jsonObj': null},
		controller:"bankPhoneCodeCtrl"
	})
	.state("transactionDetails",{//账户余额交易明细
		url:"/transactionDetails",
		templateUrl:"views/accountBalance/transactionDetails.html",
		params: {'jsonObj': null},
		cache: false,//不缓存
		controller:"transactionDetailsCtrl"
	})
	.state("fullTimeCard",{//全时通卡
		url:"/fullTimeCard?josnObj",
		cache: false,//不缓存
		templateUrl:"views/fullTimeCard/fullTimeCard.html",
		params: {'jsonObj': null},
		controller:"fullTimeCardCtrl"
	})
	.state("addFullCard",{//添加全时通卡
		url:"/addFullCard?josnObj&fullMsgObj",
		templateUrl:"views/fullTimeCard/addFullCard.html",
		params: {'jsonObj': null},
		controller:"addFullCardCtrl"
	})
	.state("rechfullTimeCard",{//全时通卡充值
		url:"/rechfullTimeCard?josnObj",
		templateUrl:"views/fullTimeCard/rechfullTimeCard.html",
		params: {'jsonObj': null},
		controller:"rechfullTimeCardCtrl"
	})
	.state("balanFullTimeCard",{//全时通卡余额
		url:"/balanFullTimeCard?josnObj",
		cache: false,//不缓存
		templateUrl:"views/fullTimeCard/balanFullTimeCard.html",
		params: {'jsonObj': null},
		controller:"balanFullTimeCardCtrl"
	})
	.state("fullCardTraDetails",{//全时通卡交易明细
		url:"/fullCardTraDetails?josnObj",
		templateUrl:"views/fullTimeCard/fullCardTraDetails.html",
		params: {'jsonObj': null},
		controller:"fullCardTraDetailsCtrl"
	})
	.state("fullCardPayMethod",{//全时通卡支付方式
		url:"/fullCardPayMethod?josnObj&fullMsgObj",
		templateUrl:"views/fullTimeCard/fullCardPayMethod.html",
		params: {'jsonObj': null},
		controller:"payWayCtrl"
	})
	.state("coupons",{//优惠券页面
		url:"/coupons",
		cache: false,//不缓存
		templateUrl:"views/coupons/coupons.html",
		controller:"couponsCtrl"
	})
	.state("sweepTheYard",{//扫码付页面
		url:"/sweepTheYard?jsonPayObj",
		cache:true,
		templateUrl:"views/sweepTheYard/sweepTheYard.html",
		controller:"sweepTheYardCtrl"
	})
	.state("sweepPayWay",{//扫码付选择支付方式
		url:"/sweepPayWay?josnObj",
		cache:true,
		templateUrl:"views/sweepTheYard/sweepPayWay.html",
		controller:"payWayCtrl"
	})
	.state("inviteCode",{//邀请码
		url:"/inviteCode",
		cache:true,
		templateUrl:"views/inviteCode/inviteCode.html",
		controller:"inviteCodeCtrl"
	})
	.state("invitationList",{//邀请名单
		url:"/invitationList",
		cache:true,
		templateUrl:"views/inviteCode/invitationList.html",
		controller:"inviteCodeCtrl"
	})
	.state("setPayPswd",{//设置支付密码
		url:"/setPayPswd?jsonObj",
		cache:true,
		templateUrl:"views/setPayPswd/setPayPswd.html",
		params: {'jsonObj': null},//这里设置为对象，用于接受对象型数据
		controller:"setPayPswdCtrl"
	})
	.state("bankList",{//银行卡列表
		url:"/bankList?josnObj",
		cache:true,
		templateUrl:"views/addBank/bankList.html",
		params: {'jsonObj': null},//这里设置为对象，用于接受对象型数据
		controller:"bankListCtrl"
	})
	.state("addBank",{//添加银行卡
		url:"/addBank?josnObj",
		cache:true,
		templateUrl:"views/addBank/addBank.html",
		controller:"addBankCtrl"
	})
	.state("agreement",{//快捷支付服务协议
		url:"/agreement",
		cache:true,
		templateUrl:"views/addBank/agreement.html",
		controller:"agreementCtrl"
	})
	.state("support",{//支持的银行
		url:"/support",
		cache:true,
		templateUrl:"views/addBank/support.html",
		controller:"supportCtrl"
	})
	.state("billList",{//账单
		url:"/billList",
		cache:true,
		templateUrl:"views/billList/billList.html",
		controller:"billListCtrl"
	})
	.state("phoneRecharge",{//手机充值
		url:"/phoneRecharge?josnObj",
		cache:true,
		templateUrl:"views/phoneRecharge/phoneRecharge.html",
		controller:"phoneRechargeCtrl"
	})
	.state("phoneRechargeRecords",{//充值记录
		url:"/phoneRechargeRecords",
		cache:true,
		templateUrl:"views/phoneRecharge/phoneRechargeRecords.html",
		controller:"phoneRechargeRecordsCtrl"
	})
	.state("payWay",{//选择支付方式
		url:"/payWay?josnObj",
		cache:true,
		templateUrl:"views/phoneRecharge/payWay.html",
		params: {'jsonObj': null},//这里设置为对象，用于接受对象型数据
		controller:"payWayCtrl"
	})
	.state("payPassword",{//手机充值支付密码
		url:"/payPassword?josnObj&jsonPayObj",
		cache:true,
		templateUrl:"views/phoneRecharge/payPassword.html",
		params: {'jsonObj': null},//这里设置为对象，用于接受对象型数据
		controller:"payPasswordCtrl"
	})
	.state("payMessage",{//手机充值银行卡短信支付
		url:"/payMessage?josnObj&jsonPayObj",
		cache:true,
		templateUrl:"views/phoneRecharge/payMessage.html",
		params: {'jsonObj': null},//这里设置为对象，用于接受对象型数据
		controller:"payMessageCtrl"
	})
	.state("topUpSuccess",{//手机充值详情
		url:"/topUpSuccess?josnObj",
		cache:true,
		templateUrl:"views/phoneRecharge/topUpSuccess.html",
		controller:"topUpSuccessCtrl"
	})
	.state("payMessageFlow",{//手机流量充值 银行卡短信支付
		url:"/payMessageFlow?jsonPayObj",
		cache:true,
		templateUrl:"views/phoneRecharge/payMessageFlow.html",
		controller:"payMessageFlowCtrl"
	})
	.state("payPasswordFlow",{//手机流量充值 支付密码
		url:"/payPasswordFlow?jsonPayObj",
		cache:true,
		templateUrl:"views/phoneRecharge/payPasswordFlow.html",
		controller:"payPasswordFlowCtrl"
	})
	.state("waterElectricityFuelGas",{//水电燃气首页
		url:"/waterElectricityFuelGas?waterJsonObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/waterElectricityFuelGas.html",
		controller:"waterElectricityFuelGasCtrl"
	})
	.state("jiaofeiRecord",{//水电燃气 没有缴费记录的情况
		url:"/jiaofeiRecord?waterJsonObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/jiaofeiRecord.html",
		controller:"jiaofeiRecordCtrl"
	})
	.state("waterAgreement",{//水电燃气服务协议
		url:"/waterAgreement",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/waterAgreement.html",
		controller:"waterAgreementCtrl"
	})
	.state("paymentRecords",{//水电燃气缴费记录
		url:"/paymentRecords",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/paymentRecords.html",
		controller:"paymentRecordsCtrl"
	})
	.state("institutionsList",{//水电燃气缴费机构选择
		url:"/institutionsList?josnObj&waterJsonObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/institutionsList.html",
		controller:"institutionsListCtrl"
	})
	.state("billingDetailsShui",{//水 账单详情
		url:"/billingDetailsShui?waterJsonObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/billingDetailsShui.html",
		controller:"billingDetailsCtrl"
	})
	.state("billingDetailsDian",{//电 账单详情
		url:"/billingDetailsDian?waterJsonObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/billingDetailsDian.html",
		controller:"billingDetailsCtrl"
	})
	.state("billingDetailsRan",{//燃气 账单详情
		url:"/billingDetailsRan?waterJsonObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/billingDetailsRan.html",
		controller:"billingDetailsCtrl"
	})
	.state("cityChanges",{//城市切换
		url:"/cityChanges?waterJsonObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/cityChanges.html",
		controller:"cityChangesCtrl"
	})
	.state("paymentConfirm",{//水电燃气确认缴费
		url:"/paymentConfirm?waterJsonObj&lifeJsonObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/paymentConfirm.html",
		controller:"paymentConfirmCtrl"
	})
	.state("paymentWay",{//水电燃气支付方式
		url:"/paymentWay?josnObj&lifeJsonObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/paymentWay.html",
		controller:"payWayCtrl"
	})
	.state("paymentMessage",{//水电燃银行卡短信支付
		url:"/payMessage?josnObj&jsonPayObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/paymentMessage.html",
		params: {'jsonObj': null},//这里设置为对象，用于接受对象型数据
		controller:"paymentMessageCtrl"
	})
	.state("paymentPassword",{//水电燃气支付密码
		url:"/paymentPassword?josnObj&jsonPayObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/paymentPassword.html",
		controller:"paymentPasswordCtrl"
	})
	.state("paymentSuccess",{//水电燃气缴费结果
		url:"/paymentSuccess?jsonObj",
		cache:true,
		templateUrl:"views/waterElectricityFuelGas/paymentSuccess.html",
		controller:"paymentSuccessCtrl"
	})
	.state("cardBalanceQuery",{//卡余额查询
		url:"/cardBalanceQuery",
		cache:true,
		templateUrl:"views/cardBalanceQuery/cardBalanceQuery.html",
		controller:"cardBalanceQueryCtrl"
	})
	.state("applyCreditCard",{//申请信用卡
		url:"/applyCreditCard",
		cache:true,
		templateUrl:"views/applyCreditCard/applyCreditCard.html",
		controller:"applyCreditCardCtrl"
	})
	.state("GongShangBank",{//工商银行信用卡 页面
		url:"/GongShangBank",
		cache:true,
		templateUrl:"views/applyCreditCard/GongShangBank.html",
		controller:"applyCreditCardCtrl"
	})
	.state("guangDaBank",{//光大银行信用卡 页面
		url:"/guangDaBank",
		cache:true,
		templateUrl:"views/applyCreditCard/guangDaBank.html",
		controller:"applyCreditCardCtrl"
	})
	.state("pingAnBank",{//平安银行信用卡 页面
		url:"/pingAnBank",
		cache:true,
		templateUrl:"views/applyCreditCard/pingAnBank.html",
		controller:"applyCreditCardCtrl"
	})
	.state("puFaBank",{//浦发银行信用卡 页面
		url:"/puFaBank",
		cache:true,
		templateUrl:"views/applyCreditCard/puFaBank.html",
		controller:"applyCreditCardCtrl"
	})
	.state("xingYeBank",{//兴业银行信用卡 页面
		url:"/xingYeBank",
		cache:true,
		templateUrl:"views/applyCreditCard/xingYeBank.html",
		controller:"applyCreditCardCtrl"
	})
	.state("transfer",{//转账
		url:"/transfer",
		cache:true,
		templateUrl:"views/transfer/transfer.html",
		controller:"transferCtrl"
	})
	.state("transferPassword",{//转账输入支付密码
		url:"/transferPassword?josnObj",
		cache:true,
		templateUrl:"views/transfer/transferPassword.html",
		controller:"transferPasswordCtrl"
	})
	.state("transferSuccess",{//转账输入支付密码后的状态
		url:"/transferSuccess?josnObj",
		cache:true,
		templateUrl:"views/transfer/transferSuccess.html",
		controller:"transferSuccessCtrl"
	})
	.state("transferRecords",{//转账记录
		url:"/transferRecords",
		cache:true,
		templateUrl:"views/transfer/transferRecords.html",
		controller:"transferRecordsCtrl"
	})
	.state("applyCard",{//申请电子卡
		url:"/applyCard?josnObj",
		cache:true,
		templateUrl:"views/applyCard/applyCard.html",
		params: {'jsonObj': null},//这里设置为对象，用于接受对象型数据
		controller:"applyCardCtrl"
	})
	.state("instructions",{//申请电子卡用卡说明
		url:"/instructions",
		cache:true,
		templateUrl:"views/applyCard/instructions.html",
		controller:"instructionsCtrl"
	})
	.state("applyCardRecords",{//申请电子卡申请记录
		url:"/applyCardRecords",
		cache:true,
		templateUrl:"views/applyCard/applyCardRecords.html",
		controller:"applyCardRecordsCtrl"
	})
	.state("information",{//申请电子卡购卡信息
		url:"/information?josnObj",
		cache:true,
		templateUrl:"views/applyCard/information.html",
		params: {'jsonObj': null},//这里设置为对象，用于接受对象型数据
		controller:"informationCtrl"
	})
	.state("applyOrder",{//申请电子卡订单详情
		url:"/applyOrder?josnObj&jsonPayObj",
		cache:true,
		templateUrl:"views/applyCard/applyOrder.html",
		params: {'jsonObj': null},//这里设置为对象，用于接受对象型数据
		controller:"applyOrderCtrl"
	})
	.state("applyPay",{//申请电子卡支付方式
		url:"/applyPay?josnObj",
		cache:true,
		templateUrl:"views/applyCard/applyPay.html",
		controller:"payWayCtrl"
	})
	.state("applyPayPassword",{//申请电子卡支付方式
		url:"/applyPayPassword?josnObj&jsonPayObj",
		cache:true,
		templateUrl:"views/applyCard/applyPayPassword.html",
		controller:"applyPayPasswordCtrl"
	})
	.state("applySuccess",{//申请电子卡交易完成后的状态
		url:"/applySuccess?josnObj",
		cache:true,
		templateUrl:"views/applyCard/applySuccess.html",
		controller:"applySuccessCtrl"
	})
	.state("applyCardList",{//申请电子卡卡列表
		url:"/applyCardList?jsonPayObj",
		cache:true,
		templateUrl:"views/applyCard/applyCardList.html",
		controller:"applyCardListCtrl"
	});
	//默认路由
	$urlRouterProvider.otherwise("/home");
});