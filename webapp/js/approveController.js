/*--------------------------------------实名认证控制器-------------------------------------------------*/
function approve($scope,$rootScope,$location,$state,$stateParams){
	var customerNameCN;
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
   customerNameCN = obj.customerNameCN;
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
   
   //定义全局变量
   var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
	var publicStr=publicKey(str);
	var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}'
	var moneyStr=publicKey(mstr);
	
	//上传图片
	/*$("#file").uploadPreview({Prompt:"prompt", Img: "ImgPr"});
	$("#file_two").uploadPreview({Prompt:"prompt_two", Img: "ImgPr_two"});*/
	//点击提交
	$scope.next_sub=function(){
		var realName=$("#username").val();
		var certNo=$("#certNo").val();
		/*var facadeImg=$("#ImgPr").attr("src");
		var backImg=$("#ImgPr_two").attr("src");*/
		//console.log(facadeImg + "<br>" + backImg);
		var parms = {};
		parms.customerNo = $scope.customerNo;
		parms.sessionId = $scope.sessionId;
		parms.realName = realName;
		parms.certNo = encryptByDES(certNo);//省份证号
		parms.certType = "1";
		parms.certExpire="";//证件有效期
		/*parms.facadeImg=facadeImg;
		parms.backImg=backImg;*/
		parms.payPwd="";//支付密码
		$.ajax({
			url :getRootPath()+"/SecurityCenterAction.certifyByUploadCert.do?FAPView=JSON",
			type:'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						$("#mark_two").css("display","block");
						$("#go_wrap").off("click").on("click",function(){
							$("#mark_two").css("display","none");
							customerNameCN=realName;
							var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
							var publicStr=publicKey(str);
							$scope.toMain(publicStr);
						})
					}else{
						$("#mark_one").css("display","block").find(".text").text(data.errors.msg);
					}
				}else if(data.FAPStatus==2){
					$("#mark_one").css("display","block").find(".text").text("请重新登录");
					$(".change").off("click").live("click",function(){
			    		$("#mark_one").css("display","none");
			    		window.location.href="./index.html";
			    	})
				}else{
					$("#mark_one").css("display","block").find(".text").text(data.FAPErrorMessage);
				}
			},
			error : function(){
				location = "index.html";
			}
		});
	}
	 //点击弹框关闭按钮
	 $scope.close=function(){
		$("#mark_one").css("display","none");
	    $("#mark_two").css("display","none");
	 }
};

angular.module("myapp")
       .controller("approve",["$scope","$rootScope","$location","$state","$stateParams",approve]);