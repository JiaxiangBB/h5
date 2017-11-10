function paymentMessageCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	$scope.customerNameCN=localStorage.getItem("customerNameData");//名字
	$scope.mobile=localStorage.getItem("mobileData");//手机号
	$scope.certNo=localStorage.getItem("certNoData");//身份证号
	//获取参数
	var params=angular.fromJson($stateParams.josnObj);
	$scope.areaName=params.areaName;//缴费地区
	$scope.cid=params.cid;//城市ID
	$scope.dataType=params.dataType;//判断哪个支付方式不可用
	$scope.itemName=params.itemName;//缴费项目
	$scope.money=params.money;//金额
	$scope.payType=params.payType;//
	$scope.picoid=params.picoid;//公司产品编号
	$scope.pid=params.pid;//所属省或直辖市
	$scope.protype=params.protype;//protype
	$scope.receiverName=params.receiverName;//公共事业单位名称
	$scope.truename=params.truename;//户主名字
	$scope.userNo=params.userNo;//水电煤卡号
	$scope.phsid = params.phsid;//缴费项目Id
	$scope.yearmonth = params.yearmonth;//缴费账单日期
	console.log(params);

	var queryParam = angular.fromJson($stateParams.jsonPayObj);
	$scope.bankCardType=queryParam.bankCardType;//卡信息
	$scope.cardNo=queryParam.cardNo;//卡号
	$scope.certNo=queryParam.certNo;//身份证号
	//$scope.money=queryParam.money;//购买金额
	console.log(queryParam);


	var date = new Date();
	var year=date.getFullYear(); 
	var month=date.getMonth()+1;
	if(parseInt(month)<10){
		month="0"+month;
	}
	var yearmonth=year+month;

	//生活缴费 点击获取验证码
	$scope.obtainCode=function(){
		var date = new Date();
		var year=date.getFullYear(); 
		var month=date.getMonth()+1;
		if(parseInt(month)<10){
			month="0"+month;
		}
    	var yearmonth=year+month;

		$(".submitBut").css("opacity","1");
		$(".messageCode").attr('disabled',"true").css({"background":"#ccc","border":"none","color":"#fff"});
		var parms = {};
    	var encryption="amount="+$scope.money+"&areaName="+$scope.areaName+"&cardNo="+encryptByDES($scope.cardNo)+"&cid="+$scope.cid+"&customerNo="+$scope.customerNo+"&inOrderorgi=01&itemName="+$scope.itemName+"&payChannel=002&payPassword="+encryptByDES("")+"&payType=26&phsid="+$scope.phsid+"&picoid="+$scope.picoid+"&pid="+$scope.pid+"&protype="+$scope.protype+"&receiverName="+$scope.receiverName+"&truename="+$scope.truename+"&userNo="+encryptByDES($scope.userNo)+"&yearmonth="+yearmonth;
    	parms.customerNo=$scope.customerNo;///
		parms.sessionId=$scope.sessionId;///
		parms.areaName=$scope.areaName;//缴费区域
		parms.receiverName=$scope.receiverName;//公共事业单位名称
		parms.userNo=encryptByDES($scope.userNo);//水电煤卡号
		parms.amount=$scope.money;//金额
		parms.payType="26";//支付类型
		parms.payChannel="002";//支付渠道 pc=005 移动=002
		parms.itemName=$scope.itemName;//缴费项目
		parms.inOrderorgi="01";//订单来源
		parms.picoid=$scope.picoid;//公司产品编号
		parms.pid=$scope.pid;//所属省或直辖市
		parms.cid=$scope.cid;//所属城市
		parms.truename=$scope.truename;//户主名字
		parms.yearmonth=yearmonth;//账单月份
		parms.cardNo=encryptByDES($scope.cardNo);//支付卡号
		parms.protype=$scope.protype;//产品类型
		parms.phsid=$scope.phsid;//缴费项目ID 
		parms.payPassword=encryptByDES("");//支付密码
		parms.signKey=publicKeyRSA(md5(encryption));
		console.log(parms);
		console.log(encryption);
		$.ajax({
			url :getRootPath()+"/ChargingPaymentAction.publicPaymentCreateBill.do?FAPView=JSON",
			data : parms,
			success : function(data) {
				$(".messageCode").removeAttr("disabled").css({"background":"none","border":"1px solid #333","color":"#333"});//删除点击按钮禁止状态
				var data=$.parseJSON(data);
				
				if(data.FAPStatus==0){
					if(data.success==true){
						var payPaymentStatus = data.data.payPaymentStatus;
						if(payPaymentStatus== "1"){//失败
							console.log(data);
							$scope.msg = data.data.errMsg;
							$scope.openModalThree();
							setTimeout(function(){
								$scope.closeModalThree();
							},1000*3);
						}else if(payPaymentStatus== "0"){//成功
							console.log(data);
							sendMessage();
							var tranflow = data.data.tranflow;
							localStorage.setItem("tranflowData",tranflow);
							console.log(tranflow);
						};
						// if(data.data.authenticate_status==1){
						// 	alert(data.data.errMsg);
						// }else{
						// 	sendMessage();
						// 	var tranflow = data.data.tranflow;
						// 	//点击提交
						// 	$scope.submitBut=function(){
						// 		curCount=0;//当前剩余秒数
						// 		$scope.paySubmit(tranflow);
						// 	};
						// }
					}else{
						$scope.msg = data.errors.msg;
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
					}
				}else if(data.FAPStatus==2){
					loginH5Host();
				}else{
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
	$scope.paySubmit=function(tranflow){
		var date = new Date();
		var year=date.getFullYear(); 
		var month=date.getMonth()+1;
		if(parseInt(month)<10){
			month="0"+month;
		}
    	var yearmonth=year+month;

		$(".submitBut").attr('disabled',"true").css("opacity","0.4");
		var payValidateCode=$(".obtainCode input").val();
		console.log(payValidateCode);
		$scope.tranflow = localStorage.getItem("tranflowData");
		console.log($scope.tranflow);
		if(payValidateCode==""){
			$scope.msg = "验证码不可为空"
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}else{
			var parms={};
			parms.customerNo=$scope.customerNo;
			parms.sessionId=$scope.sessionId;
			parms.areaName=$scope.areaName;//缴费区域
			parms.receiverName=$scope.receiverName;//公共事业单位名称
			parms.userNo=encryptByDES($scope.userNo);//水电煤卡号
			parms.amount=$scope.money;//金额
			parms.payType="26";//支付类型
			parms.payChannel="002";//支付渠道
			parms.itemName=$scope.itemName;;//缴费项目
			parms.inOrderorgi="01";//订单来源
			parms.picoid=$scope.picoid;//公司产品编号
			parms.pid=$scope.pid;//所属省或直辖市
			parms.cid=$scope.cid;//所属城市 
			parms.truename=$scope.truename;//户主名字
			parms.yearmonth=yearmonth;//账单月份
			parms.cardNo=encryptByDES($scope.cardNo);//支付卡号
			parms.protype=$scope.protype;//产品类型
			parms.mobileCode=encryptByDES(payValidateCode); //短信验证码
			parms.tranFlowNo=$scope.tranflow;//订单号
			var encryption="amount="+$scope.money+"&areaName="+$scope.areaName+"&cardNo="+encryptByDES($scope.cardNo)+"&cid="+$scope.cid+"&customerNo="+$scope.customerNo+"&inOrderorgi=01&itemName="+$scope.itemName+"&mobileCode="+encryptByDES(payValidateCode)+"&payChannel=002&payType=26&picoid="+$scope.picoid+"&pid="+$scope.pid+"&protype="+$scope.protype+"&receiverName="+$scope.receiverName+"&tranFlowNo="+$scope.tranflow+"&truename="+$scope.truename+"&userNo="+encryptByDES($scope.userNo)+"&yearmonth="+yearmonth;
			parms.signKey=publicKeyRSA(md5(encryption));
			console.log(encryption);
			console.log(parms.signKey);
			$.ajax({//ChargingPaymentAction.publicPaymentCreateBillConfirm
				url :getRootPath()+"/ChargingPaymentAction.publicPaymentCreateBillConfirm.do?FAPView=JSON",
				data : parms,
				success : function(data) {
					$(".submitBut").removeAttr("disabled").css("opacity","1");
					var data=$.parseJSON(data);
					console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							if(data.data.payPaymentStatus==1){
								alert(data.data.errMsg);
							}else{//成功
								$scope.errMsg = data.data.errMsg;//缴费信息 成功或者失败
								$scope.tranflow = data.data.tranflow;//订单号
								$scope.transactionOrderDetail = data.data.transactionOrderDetail;//缴费详情
								$scope.truename = data.data.truename;//户主名字
								$scope.userNo = data.data.userNo;//缴费账户号

								var obj = {errMsg:$scope.errMsg,tranflow:$scope.tranflow,transactionOrderDetail:$scope.transactionOrderDetail,truename:$scope.truename,userNo:$scope.userNo,receiverName:$scope.receiverName};
								var jsonObj= angular.toJson(obj);
								$state.go("paymentSuccess",{jsonObj:jsonObj})
							}					
						}else{
							$scope.msg = data.errors.msg;
							$scope.openModalThree();
							setTimeout(function(){
								$scope.closeModalThree();
							},1000*3);
						}
					}else if(data.FAPStatus==2){
						loginH5Host();
					}else{
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

	//弹框3
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
		.controller("paymentMessageCtrl",['$scope','$stateParams','$state','$ionicModal',paymentMessageCtrl]);