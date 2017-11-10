function informationCtrl($scope,$http,$state,$stateParams,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	var queryParam = angular.fromJson($stateParams.josnObj);
	var customerNameCN=queryParam.customerNameCN;//名字
	var mobile=queryParam.mobile;//手机号
	var certNo=queryParam.certNo;//身份证号
	var cardSelect=queryParam.cardSelect;//电子卡类型
	//点击显示选择面额
	$scope.denomination=function(){
		$(".informationMask").show();
		$(".selectDenomination").animate({bottom:'0'});
	};
	//点击选择面额
	$(".choice").off("click").on("click",function(){
		$(".informationMask").hide();
		$(".selectDenomination").animate({bottom:'-2.8rem'});
		$(".denomination input").val($(this).text());
		$(".next").css("opacity","1");
	});
	//关闭选择面额
	$scope.close=function(){
		$(".informationMask").hide();
		$(".selectDenomination").animate({bottom:'-2.8rem'});
	};
	//点击确认是否需要发票
    $(".invoiceJudge input").off("click").on("click",function(){
	   if($(this).attr("data-type")=="yes"){
		   $(".invoiceTitle").show();
		   $(".invoiceNum").show();
	   }else if($(this).attr("data-type")=="no"){
		   $(".invoiceTitle").hide();
		   $(".invoiceNum").show();
	   };
	});
	//根据判断获取是否有发票的参数
	var isDill,dillName,invoiceNum;
	

	//申请电子卡张数设置 卡产品数量查询
	var parms = {};
	$http({
	   method:"POST",
	   url:getRootPath()+"/EcardAction.getCardProductCount.do?FAPView=JSON",
	   data:parms
	}).success(function(data) {
		//console.log("卡产品数量查询");
		console.log(data);
		if(data.FAPStatus==0){
			if(data.success==true){
				var numberr;
				if(data.data.list.length==0){
					numberr=5;
				}else{
					if(data.data.list[0].numberr<=5){
						numberr=data.data.list[0].numberr;
					}else{
						numberr=5;
					}	
				};
				$(".reduce").off("click").on("click",function(){
					if($(".buyCardsNum").val()<=1){
						$(".buyCardsNum").val(1);
					}else{
						$(".buyCardsNum").val(parseInt($(".buyCardsNum").val())-1);
					}
				});
				$(".plus").off("click").on("click",function(){
					if($(".buyCardsNum").val()>=numberr){
						$(".buyCardsNum").val(5);
					}else{
						$(".buyCardsNum").val(parseInt($(".buyCardsNum").val())+1);
					}
				});
				$(".buyCardsNum").blur(function(){ 
					if($(".buyCardsNum").val()<=1){
						$(".buyCardsNum").val(1);
					}else if($(".buyCardsNum").val()>=numberr){
						$(".buyCardsNum").val(5);
					}
				});
				
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
	}).error(function(a,b,c){
		//alert("错误");
	});		
	//点击下一步
	$scope.applyOrder=function(){
		if($(".next").css("opacity")=="1"){
			//根据判断获取是否有发票的参数
			if($(".invoiceJudge input:checked").attr("data-type")=="yes"){
				isDill=1;
				dillName=$(".invoiceTitle input").val();//发票抬头
				invoiceNum = $(".invoiceNum input").val();//发票税号
				if(dillName=="" || invoiceNum ==""){
					$scope.msg = "请输入发票抬头或发票税号！";
				    $scope.openModalThree();
				    setTimeout(function(){
				        $scope.closeModalThree();
				    },1000*3);
					return;
				}
			}else{
				isDill=0;
				dillName="";
				invoiceNum="";
			}
		}else{
			//alert("请选择购卡面额");
			$scope.msg = "请选择购卡面额";
		    $scope.openModalThree();
		    setTimeout(function(){
		        $scope.closeModalThree();
		    },1000*3);
			return;
		}
		var obj = {certNo:certNo,customerNameCN:customerNameCN,mobile:mobile,cardSelect:cardSelect};
	    var jsonObj= angular.toJson(obj);
		var payObj = {money:$(".denomination input").val(),number:$(".buyCardsNum").val(),dillName:dillName,isDill:isDill};
	    var jsonPayObj= angular.toJson(payObj);
	    $state.go('applyOrder',{'josnObj':jsonObj,'jsonPayObj':jsonPayObj});
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
};
angular.module("myapp")
		.controller("informationCtrl",['$scope','$http','$state','$stateParams','$ionicModal',informationCtrl]);