function bankListCtrl($scope,$stateParams,$state,$ionicModal){
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	var queryParam = angular.fromJson($stateParams.josnObj);
	$scope.customerNameCN=queryParam.customerNameCN;//名字
	$scope.mobile=queryParam.mobileNo;//手机号
	$scope.certNo=queryParam.certNo;//身份证号
	
	//没有记录时的背景图
	$(".empty img").attr("src",imgRrc+"h5images/icon_wujilu@3x.png");

	//点击银行卡操作
	$(".bankList li").off("click").live("click",function(){
		$(".mask").show();
	});
	//点击取消银行卡操作
	$(".mask .bottom").off("click").on("click",function(){
		$(".mask").hide();
	});

	//初始化银行卡
	$scope.initListBank = function(){
		var parms = {};
		parms.customerNo = $scope.customerNo;//客户号
		parms.sessionId = $scope.sessionId;//令牌号
		parms.beginPos = 1;//起始位置
		parms.pageSize = 10;//页面记录数
		$.ajax({
			url :getRootPath()+"/AccountAction.bankAccListQuery.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						$scope.bankcard_list = data.data.perBankAccInfList.result;
						$scope.bank_num = $scope.bankcard_list.length;
						$scope.$apply();
						if($scope.bank_num>0){
							$(".bankList").show().siblings().hide();
							for(var n=0;n<$scope.bankcard_list.length;n++){
								var bankcardNo = $scope.bankcard_list[n].bafAccountno;//银行卡号
								var BANKNAME = $scope.bankcard_list[n].bankName;
								var bafAcctype = $scope.bankcard_list[n].bafAcctype;
								if(bafAcctype=="0"){
									$(".bankList ul li").eq(n).find('.bankType').text("储蓄卡");
								}else{
									$(".bankList ul li").eq(n).find('.bankType').text("信用卡");
								}
								var img="";
								img=bankCard(BANKNAME,img);
								var interceptBank = bankcardNo.substring(6,bankcardNo.length-4);//截取卡号中间9位
								var interceptBankCardno = bankcardNo.substr(0,6)+interceptBank.replace(interceptBank,"*********")+bankcardNo.substr(bankcardNo.length-4,4);
								var arr=[];
								for(var i=0;i<interceptBankCardno.length;i++){
									if(i%4==0){
										arr.push(interceptBankCardno.substr(i,4));
									}
								}
								if(arr.length==5){
									var bankNum = arr[0]+" "+arr[1]+" "+arr[2]+" "+arr[3]+" "+arr[4];
								}else{
									var bankNum = arr[0]+" "+arr[1]+" "+arr[2]+" "+arr[3];
								}
								$(".bankList ul li").eq(n).find(".bankName").text(BANKNAME);
								$(".bankList ul li").eq(n).find(".bankNum").text(bankNum);
								$(".bankList ul li").eq(n).find("p img").attr("src",img);
							}
						}else{
							$(".bankList").hide().siblings().show();
						} 
					}else{
						//alert(data.errors.msg);
						$scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					}
				}else if(data.FAPStatus==2){
					loginH5Host();//从新调登录接口
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
				alert("错误");
			}					
		});
  	};
  	$scope.initListBank();
  	//添加银行卡
  	$scope.addBank=function(){
  		var obj = {certNo:$scope.certNo,customerNameCN:$scope.customerNameCN,mobileNo:$scope.mobile};
	    var jsonObj= angular.toJson(obj);
  		$state.go("addBank",{josnObj:jsonObj});
  	}

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
		.controller("bankListCtrl",['$scope','$stateParams','$state','$ionicModal',bankListCtrl]);