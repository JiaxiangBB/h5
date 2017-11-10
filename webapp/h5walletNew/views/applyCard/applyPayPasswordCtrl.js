function applyPayPasswordCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	var queryParam = angular.fromJson($stateParams.josnObj);
	$scope.customerNameCN=queryParam.customerNameCN;//名字
	$scope.mobile=queryParam.mobile;//手机号
	$scope.certNo=queryParam.certNo;//身份证号
	
	var queryParamTwo = angular.fromJson($stateParams.jsonPayObj);
	$scope.cardNo=queryParamTwo.cardNo;//支付卡号
	$scope.money=queryParamTwo.money;//支付金额
	$scope.orderno=queryParamTwo.orderno;//订单号
	$scope.amount=queryParamTwo.amount;//支付面额
	$scope.moneys=fmoney($scope.money,2);
	//console.log($scope.money)
	//点击获取验证码
	$scope.obtainCode=function(){
		$(".submitBut").css("opacity","1");
		$(".messageCode").attr('disabled',"true").css({"background":"#ccc","border":"none","color":"#fff"});
		var encryption ="accountNo="+encryptByDES($scope.cardNo)+"&channelType=005&customNo="+$scope.customerNo+"&initAmt="+$scope.money+"&orderNo="+$scope.orderno+"&payType=3";
		var parms = {};
		parms.orderNo = $scope.orderno;//订单号
		parms.initAmt = $scope.money;//充值金额，总金额
		parms.channelType = "005";//渠道类型
		parms.accountNo = encryptByDES($scope.cardNo);//银行卡号
		parms.customNo = $scope.customerNo;//客户号;//用户编号，跟userid一个值
		parms.payType = "26";
		
		parms.signKey=publicKeyRSA(md5(encryption));
		//console.log(parms.signKey);
		$.ajax({
			url :getRootPath()+"/EcardAction.cardRecharge.do?FAPView=JSON",
			data : parms,
			success : function(data) {
				$(".messageCode").removeAttr("disabled").css({"background":"none","border":"1px solid #333","color":"#333"});//删除点击按钮禁止状态
				var data=$.parseJSON(data);
				console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.authenticate_status==1){
							//alert(data.data.errMsg);
							$scope.msg = data.errors.msg;
			                $scope.openModalThree();
			                setTimeout(function(){
			                    $scope.closeModalThree();
			                },1000*3);
						}else{
							sendMessage();
							var order_no = data.data.orderno;
							var scoorderno = data.data.scoorderno;
							//点击提交
							$scope.submitBut=function(){
								curCount=0;//当前剩余秒数
								$scope.paySubmit(order_no,scoorderno);
							};
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
					loginH5Host();
				}else{
					//alert(data.FAPErrorMessage);
					$scope.msg = data.FAPErrorMessage;
	                $scope.openModalThree();
	                setTimeout(function(){
	                    $scope.closeModalThree();
	                },1000*3);
				};
			},
			error:function(a,b,c){
				$(".messageCode").removeAttr("disabled").css({"background":"none","border":"1px solid #333","color":"#333"});//删除点击按钮禁止状态
				//alert("错误");
			}					
		});
	};
	//点击确认支付
	$scope.paySubmit=function(order_no,scoorderno){
		$(".submitBut").attr('disabled',"true").css("opacity","0.4");
		var payValidateCode=$(".obtainCode input").val(),amount=$scope.amount;
		var encryption ="amount="+amount+"&author="+$scope.customerNo+"&enterbank="+encryptByDES($scope.cardNo)+"&orderno="+order_no+"&payType=3&payValidateCode="+encryptByDES(payValidateCode)+"&scoorderno="+scoorderno;
		if(payValidateCode==""){
			//alert("验证码不可为空");
			$scope.msg = "验证码不可为空";
            $scope.openModalThree();
            setTimeout(function(){
                $scope.closeModalThree();
            },1000*3);
		}else{
			var parms = {};
			parms.author = $scope.customerNo;;//同userId
			parms.payValidateCode = encryptByDES(payValidateCode);//验证码
			parms.scoorderno= scoorderno;//流水号
			parms.enterbank = encryptByDES($scope.cardNo);//银行卡号
			//parms.amount= amount;//面额
			parms.amount= amount;//面额测试
			parms.payType="3";//付款方式 请传3
			parms.orderno = order_no;//订单号
			parms.signKey=publicKeyRSA(md5(encryption));
			$.ajax({
				url :getRootPath()+"/EcardAction.cardOrderAudit.do?FAPView=JSON",
				data : parms,
				success : function(data) {
					$(".submitBut").removeAttr("disabled").css("opacity","1");
					var data=$.parseJSON(data);
					console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							if(data.data.authenticate_status==1){
								//alert(data.data.errMsg);
								$scope.msg = data.errors.msg;
				                $scope.openModalThree();
				                setTimeout(function(){
				                    $scope.closeModalThree();
				                },1000*3);
							}else{
								var obj = {amount:data.data.amount,orderno:order_no,cardnum:data.data.cardnum,createTime:data.data.createTime,money:$scope.money};
	   							var jsonObj= angular.toJson(obj);
								$state.go("applySuccess",{josnObj:jsonObj})
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
						loginH5Host();
					}else{
						//alert(data.FAPErrorMessage);
						$scope.msg = data.FAPErrorMessage;
		                $scope.openModalThree();
		                setTimeout(function(){
		                    $scope.closeModalThree();
		                },1000*3);
					};
				},
				error:function(a,b,c){
					$(".submitBut").removeAttr("disabled").css("opacity","1");
					//alert("错误");
				}					
			});
		}
			
	};

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
		.controller("applyPayPasswordCtrl",['$scope','$stateParams','$state','$ionicModal',applyPayPasswordCtrl]);