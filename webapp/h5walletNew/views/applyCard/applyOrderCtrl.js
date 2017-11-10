function applyOrderCtrl($scope,$stateParams,$state,$http,$ionicModal){
	//订单详情图片
	$(".applyOrder h2 img").attr("src",imgRrc+"h5images/icon_zhuannext_money_w"+variable+".png");
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	var queryParam = angular.fromJson($stateParams.josnObj);
	$scope.customerNameCN=queryParam.customerNameCN;//名字
	$scope.mobile=queryParam.mobile;//手机号
	$scope.certNo=queryParam.certNo;//身份证号
	$scope.cardSelect=queryParam.cardSelect;//电子卡类型
	
	var queryParamTwo = angular.fromJson($stateParams.jsonPayObj);
	$scope.number=queryParamTwo.number;//购卡数量
	$scope.money=queryParamTwo.money;//购卡面额
	$scope.dillName=queryParamTwo.dillName;//发票抬头
	$scope.isDill=queryParamTwo.isDill;//是否需要发票
	$scope.dataType="5";//只支持银行卡支付
	$scope.payType="1";
	$scope.moneys=$scope.money*parseInt($scope.number);//总金额
	//获取当前时间
	var date = new Date();
	$scope.beginDate=getNowFormatDate(date.getFullYear());//开始时间
	$scope.time=$scope.beginDate.substr(0,4)+"/"+$scope.beginDate.substr(4,2)+"/"+$scope.beginDate.substr(6,2);
	if($scope.isDill==0){
		$scope.invoiceJudge=false;
	}else{
		$scope.invoiceJudge=true;
	}
	//去修改
	$scope.modify=function(){
		var obj = {certNo:$scope.certNo,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobile};
	    var jsonObj= angular.toJson(obj);
		$state.go("information",{josnObj:jsonObj})
	};
	//点击立即支付
	$(".applyPay").off("click").on("click",function(){
	    $(this).attr('disabled',"true").css("opacity","0.4");
	    var params={};
		params.userId=$scope.customerNo;//客户号
		params.cardType=$scope.cardSelect;//卡种类
		params.cardNum=$scope.number;//申请数量
		params.isDill=$scope.isDill;//是否开发票
		params.dillName=$scope.dillName;//发票抬头名称
		params.totalPayAmount=$scope.moneys;//总金额
		params.amount=$scope.money;//卡面额
		$.ajax({//申请电子卡订单确认接口
			url :getRootPath()+"/EcardAction.confirmCardOrder.do?FAPView=JSON",
			data : params,
			success : function(data) {
				$(".applyPay").removeAttr("disabled");//删除点击禁止事件
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==false){
						//alert(data.errors.msg);
						$scope.msg = data.errors.msg;
		                $scope.openModalThree();
		                setTimeout(function(){
		                    $scope.closeModalThree();
		                },1000*3);
					}else{
						var orderno = data.data.orderno;
						var obj = {amount:$scope.money,orderno:orderno,certNo:$scope.certNo,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobile,dataType:$scope.dataType,money:$scope.moneys,payType:$scope.payType};
	   					var jsonObj= angular.toJson(obj);
						$state.go("applyPay",{josnObj:jsonObj});
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
				$(".applyPay").removeAttr("disabled");//删除点击禁止事件
	//					alert("错误");
			}					
		});	
		
	});

	//弹框
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
		.controller("applyOrderCtrl",['$scope','$stateParams','$state','$http','$ionicModal',applyOrderCtrl]);