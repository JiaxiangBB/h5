function applyCardRecordsCtrl($scope,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");

	//没有记录时的背景图
	$(".empty img").attr("src",imgRrc+"h5images/icon_wujilu@3x.png");
	//申请电子卡记录
	$(".applyCardRecords img").attr("src",imgRrc+"h5images/icon_qstcard_yue"+variable+".png");

	var parms = {};
	parms.customerNo=$scope.customerNo;
	$.ajax({
		url :getRootPath()+"/EcardAction.queryCardList.do?FAPView=JSON",
		data : parms,
		success : function(data) {
			var data=$.parseJSON(data);
			//console.log(data);
			if(data.FAPStatus==0){
				if(data.list.length==0){
					$(".empty").show().siblings().hide();
				}else{
					$(".empty").hide().siblings().show();
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
//					alert("错误");
		}					
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
		.controller("applyCardRecordsCtrl",['$scope','$ionicModal',applyCardRecordsCtrl]);