function cardBalanceQueryCtrl($scope,$ionicModal){
	//$ionicLoading.show();//显示加载指示器
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	// 卡余额查询 页面
	$("#cardBalanceQuery-view .cardBalanceQuery .lock").css("background-image","url("+imgRrc+"h5images/icon_kahao"+variable+".png)");
	$("#cardBalanceQuery-view .cardBalanceQuery .passwordka").css("background-image","url("+imgRrc+"h5images/icon_mima_black"+variable+".png)");

	//卡余额查询 点击查询按钮
	$scope.fullCardsQuery = function(){
		//$scope.openModalFour();
		var cardNumber= $("#cardBalanceQuery-view .fullCardNum").val(); //全时通卡卡号
		var cardPassword = $("#cardBalanceQuery-view .fullCardPsW").val();//密码
		var ruleCardNum = /^(\d{19})\s*$/;//全时通卡1-19位数字
		var isNum = ruleCardNum.test(cardNumber);
		var ruleCardPsw = /^\d{6}\s*$/;//请输入6位卡密码
		var isPsw = ruleCardPsw.test(cardPassword);
		console.log(isPsw);
		if(cardPassword == "" || cardNumber ==""){
			$scope.msg = "全时通卡号或卡密码不可为空";
		    //console.log($scope.msg);
		    //认证失败 弹框
		    $scope.openModalThree();
		    setTimeout(function(){
		        $scope.closeModalThree();
		    },1000*3);
		}else{
			if(isPsw == true && isNum == true){
				//alert("正确");
				var parms = {};
				parms.customerNo= $scope.customerNo;//客户号
				parms.sessionId = $scope.sessionId;//ID
				parms.cardNo = cardNumber;//卡号
				parms.cardPayPwd = cardPassword;//密码
				$.ajax({
					url :getRootPath()+"/PrepaidCardAction.prepaidCardBalQuery.do?FAPView=JSON",
					type: 'post',
					data : parms,
					success : function(data) {
						var data=$.parseJSON(data);
						console.log("---------卡余额查询--------");
						console.log(data.data)
						if(data.FAPStatus==0){
        					if(data.success==true){
        						$scope.availableBalance = data.data.availableBalance;
        						$scope.msg = $scope.availableBalance;
        						$scope.cardNumber = cardNumber.substring(15,cardNumber.length);//全时通卡卡号后四位
        						
							    $scope.openModalFour();
							    $scope.sureQueryFun = function(){
							    	$scope.closeModalFour();
							    };
        					}else{
        						$scope.msg = data.errors.msg;
							    $scope.openModalThree();
							    setTimeout(function(){
							        $scope.closeModalThree();
							    },1000*3);
        					}
        				}else{
        					$scope.msg = data.FAPErrorMessage;
						    $scope.openModalThree();
						    setTimeout(function(){
						        $scope.closeModalThree();
						    },1000*3);
        				}
						
					},
					error:function(a,b,c){
//						alert("错误");
					}					
				});
			}else{
				$scope.msg = "请输入正确的全时通卡卡号或卡密码";
			    //console.log($scope.msg);
			    //认证失败 弹框
			    $scope.openModalThree();
			    setTimeout(function(){
			        $scope.closeModalThree();
			    },1000*3);
			}
		}
	};
 	//modalThree弹框
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
	//卡余额 查询 模板调用
	$ionicModal.fromTemplateUrl('templates/modalFour.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modalFour = modal;
	});
	$scope.openModalFour = function() {
		$scope.modalFour.show();
	};
	$scope.closeModalFour = function() {
		$scope.modalFour.hide();
	};
};
angular.module("myapp")
		.controller("cardBalanceQueryCtrl",['$scope','$ionicModal',cardBalanceQueryCtrl]);