function applyCardListCtrl($scope,$stateParams,$ionicModal){
    //公共参数
    $scope.customerNo=getURLParameter("customerNo");
    $scope.sessionId=localStorage.getItem("data");
    var queryParam = angular.fromJson($stateParams.jsonPayObj);
    $scope.orderno=queryParam.orderno;//订单号
    var parms = {};
    parms.orderno=$scope.orderno;
    $.ajax({
        url :getRootPath()+"/EcardAction.getCardInfDetail.do?FAPView=JSON",
        data : parms,
        success : function(data) {
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
                    $scope.list=data.list;//订单号
                    for(var i=0;i<$scope.list.length;i++){
                        if($scope.list[i].status=="已绑卡"){
                            $(".notActive").css("background","#bbb");
                        }else if($scope.list[i].status=="冻结"){
                            $(".notActive").css("background","#B8C9E0");
                        }else if($scope.list[i].status=="锁定"){
                            $(".notActive").css("background","#E6B8AE");
                        }else if($scope.list[i].status=="退卡"){
                            $(".notActive").css("background","#A4A6BA");
                        }else if($scope.list[i].status=="销毁"){
                            $(".notActive").css("background","#D2BDA8");
                        }else{
                            $(".notActive").css("background","#EA5532");
                        }
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
//                  alert("错误");
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
        .controller("applyCardListCtrl",['$scope','$stateParams','$ionicModal',applyCardListCtrl]);