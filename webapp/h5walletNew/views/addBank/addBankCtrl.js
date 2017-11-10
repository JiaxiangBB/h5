function addBankCtrl($scope,$state,$stateParams,$ionicModal){
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");

	var queryParam = angular.fromJson($stateParams.josnObj);
	$scope.customerNameCN=queryParam.customerNameCN;//名字
	$scope.mobile=queryParam.mobile;//手机号
	$scope.certNo=queryParam.certNo;//身份证号
	$scope.phone=$scope.certNo.substr(0,4)+"***********"+$scope.certNo.substr(14,3)
	
	//添加银行卡背景图片
	$(".addBank .bank_Num").css("background-image","url("+imgRrc+"h5images/icon_wodeyinhangka"+variable+".png)");
	$(".addBank .bank_Card").css("background-image","url("+imgRrc+"h5images/icon_idcard_realname"+variable+".png)");
	$(".addBank .bank_phone").css("background-image","url("+imgRrc+"h5images/icon_tel_drak"+variable+".png)");

	
	//判断储蓄卡还是信用卡事件
	$(".bankCardNum").blur(function(){
		if($(this).val()==""){
			//alert("银行卡不可为空");
			$scope.msg = "银行卡不可为空";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
		}else{
		  	var reg = /^(\d{16}|\d{17}|\d{18}|\d{19})$/;
		  	var result=reg.test($(this).val());
		  	if(result==true){
				var parms = {};
				parms.cardNo = encryptByDES($(this).val());//卡号
				$.ajax({
					url :getRootPath()+"/AccountAction.getCardInf.do?FAPView=JSON",
					type: 'post',
					data : parms,
					success : function(data) {
						var data=$.parseJSON(data);
						//console.log(data);
						if(data.FAPStatus==0){
							if(data.success==true){
								var cardtype = data.data.cardtype;
								$(".savingsDeposit").show();
								$(".submitBut").css("opacity",1);
								if(cardtype == "0"){//储蓄卡
									$(".savingsDeposit input").val("储蓄卡/"+data.data.bankName);
									$(".creditCard").hide();
									//点击提交事件
									$scope.submitBut=function(){
										$scope.addBankBtn(0);
									};
								}else if(cardtype == "1"){//信用卡
									$(".savingsDeposit input").val("信用卡/"+data.data.bankName);
									$(".creditCard").show();
									//点击提交事件
									$scope.submitBut=function(){
										$scope.addBankBtn(1);
									};
								}
							}else{
								if(data.errors.msg=="卡号没有对应carben"){
									//alert("不支持此银行卡的绑定");
									$scope.msg = "不支持此银行卡的绑定";
									$scope.openModalThree();
									setTimeout(function(){
										$scope.closeModalThree();
									},1000*3);	
								}else{
									//alert(data.errors.msg);
							    	$scope.msg = data.errors.msg;
									$scope.openModalThree();
									setTimeout(function(){
										$scope.closeModalThree();
									},1000*3);										
								}	
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
					//	alert("错误");
					}					
				});
			}else{
				//alert("银行卡号格式错误");
		    	$scope.msg = "银行卡号格式错误";
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);				
			}  
		}
	});
	//点击提交事件
	$scope.addBankBtn=function(type){
		$(".submitBut").css("opacity","0.4").attr('disabled',"true");//添加禁止点击事件
		var theName = $scope.customerNameCN;//姓名	
	    var idNumber = $scope.certNo;//身份证号
	    var banksPhoneNumber = $(".bankCardPhone").val();//银行预留手机号
	    var addCardNumber = $(".bankCardNum").val();//银行卡卡号
	    var bankCardDate = $(".bankCardDate").val();//贷记卡有效期
	    var bankCardCvv = $(".bankCardCvv").val();//CVV2码
	    var random = Math.floor(Math.random()*10+1);//随机数
	    var rules_phone = /^1[34578][0-9]{9}$/;
    	var isTel=rules_phone.test(banksPhoneNumber); 
	    if(banksPhoneNumber==""){
	    	//alert("手机号不可为空");
	    	$scope.msg = "手机号不可为空";
			$scope.openModalThree();
			setTimeout(function(){
				$scope.closeModalThree();
			},1000*3);
	    	$(".submitBut").css("opacity","1").removeAttr("disabled");//删除点击按钮禁止状态
	    }else{
	    	if(isTel==false){
	    		//alert("手机号格式错误");
	    		$scope.msg = "手机号格式错误";
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
	    		$(".submitBut").css("opacity","1").removeAttr("disabled");//删除点击按钮禁止状态
	    	}else{
	    		var parms = {};
			    parms.channelType = "004";//渠道来源
				parms.payType = "26";//支付类型
				parms.customerNo = $scope.customerNo ;//客户号
				parms.accountNo = encryptByDES(addCardNumber) ;//银行卡号
				parms.custNm = theName ;//银行卡号姓名
				parms.mobile = encryptByDES(banksPhoneNumber) ;//银行卡预留手机号
				parms.isFlag = "0"  ;//开通快捷支付
				parms.settFlg = "0"  ;//是否是提现账户
				parms.sessionId = $scope.sessionId ;//sessionId
				parms.certno = encryptByDES(idNumber) ;//身份证号
				parms.ctftype = "1" ;//身份证类型
				parms.trcNo = random ;//协议号 随机数
				if(type==1){
					parms.expiryDate = bankCardDate;//贷记卡有效期
					parms.cvv = encryptByDES(bankCardCvv);//CVV2码
					if(bankCardDate=="" || bankCardCvv==""){
						//alert("有效期及cvv码不可为空");
						$scope.msg = "有效期及cvv码不可为空";
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
						$(".submitBut").css("opacity","1").removeAttr("disabled");//删除点击按钮禁止状态
					}else{
						$scope.addBank(parms);
					}
				}else{
					$scope.addBank(parms);
				}
	    	}
	    }    
	};
	$scope.addBank=function(parms){
		$.ajax({
			url :getRootPath()+"/ThridPayAccountAction.bankCardBindByQuick.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				$(".submitBut").css("opacity","1").removeAttr("disabled");//删除点击按钮禁止状态
				if(data.FAPStatus==0){
					if(data.success==true){
						//alert("添加银行卡成功");
						$scope.msg = "添加银行卡成功";
						$scope.openModalThree();
						setTimeout(function(){
							$scope.closeModalThree();
						},1000*3);
						$state.go('home');
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
					$scope.msg = data.FAPErrorMessage;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
					//alert(data.FAPErrorMessage);
				}
			},
			error:function(a,b,c){
			//	alert("错误");
			}					
		});
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
		.controller("addBankCtrl",['$scope','$state','$stateParams','$ionicModal',addBankCtrl]);