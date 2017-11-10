function inviteCodeCtrl($scope,$stateParams,$state,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	console.log($scope.customerNo);

	$scope.inviteCode = $scope.customerNo.substr(6,4);
	$scope.inviteCodeOne = $scope.inviteCode.substr(0,1);
	$scope.inviteCodeTwo = $scope.inviteCode.substr(1,1);
	$scope.inviteCodeThree = $scope.inviteCode.substr(2,1);
	$scope.inviteCodeFour = $scope.inviteCode.substr(3,1);
	
	// $scope.type=0;
	// //没有记录时的背景图
	// $(".empty img").attr("src",imgRrc+"h5images/icon_wujilu@3x.png");
	// if($scope.type==0){
	// 	$(".invitationList").hide().siblings().show();
	// }else{
	// 	$(".invitationList").show().siblings().hide();
	// }

	var parm = {}
	parm.customerNo = $scope.customerNo;//客户号
	parm.sessionId = $scope.sessionId;//sessionId
	$.ajax({
		url :getRootPath()+"/CustomerAction.myInvitationList.do?FAPView=JSON",
		data : parm,
		success : function(data) {
			var data=$.parseJSON(data);
			console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					var myInvitationList = data.data.myInvitationList;
					console.log(myInvitationList.length);
					if(myInvitationList.length == 0){
						$(".empty img").attr("src",imgRrc+"h5images/icon_wujilu@3x.png");
						$(".invitationList").hide().siblings().show();
					}else{
						$(".invitationList").show().siblings().hide();
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
			};
		},
		error:function(a,b,c){
			//alert("错误");
		}					
	});
};
angular.module("myapp")
		.controller("inviteCodeCtrl",['$scope','$stateParams','$state','$ionicModal',inviteCodeCtrl]);