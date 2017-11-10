function cityChangesCtrl($http,$stateParams,$location,$rootScope, $scope, $state, $filter, $ionicHistory,$ionicLoading,$ionicScrollDelegate){
    var queryParam = angular.fromJson($stateParams.waterJsonObj);
    $scope.text=queryParam.text;//名字
    $scope.type=queryParam.type;//缴费类型 1 水费  2 电费  3 燃气费
    $scope.phsid = queryParam.phsid;//
    $scope.city = queryParam.city;//缴费地区
    $scope.message = queryParam.message;//

    $scope.searchEmptyShow=false;//是否显示清除输入的图标
    $scope.showMiddle=false; //是否在屏幕中央显示选中的字母索引
    $scope.hIndex=(window.screen.height-44-4)/26;//右边侧边栏每个字母的高度，是屏幕高度减去标题栏的44，减去页面样式中的margin-top:2px，margin-bottom:2px,再除以26，这样以保证在各个手机屏幕上的字母的距离的均等性
    var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $scope.indexs=[];
    loadData();
    for(var i=0;i<chars.length;i++){
        $scope.indexs.push(chars.charAt(i));//获取字母数组 
    }
    $scope.startDot=function(){//判断清除输入框的图标是否显示
        if($scope.cityName.length=0 || $scope.cityName==""){
            $scope.searchEmptyShow=false;
        }else{
            $scope.searchEmptyShow=true;
        }
    };
    $scope.searchEmpty=function(){//点击清除输入框的图标的点击事件
        $scope.searchEmptyShow=false;
        $scope.cityName="";
    };

    $scope.mTouch=function(event){ 
      var positionX=event.pageX || event.touches[0].pageX;
      var positioinY=event.pageY || event.touches[0].pageY;
      var ele = document.elementFromPoint(positionX,positioinY);  
      if(!ele){
        return;
      }
      var c=ele.innerText;
      if(!c || c==" " || c.length!=1){
        return;
      }
      $scope.hint=c; 
      $scope.showMiddle=true;    

      var scroll = document.getElementById("city_"+$scope.hint).offsetTop -    $ionicScrollDelegate.getScrollPosition().top; 
      $ionicScrollDelegate.scrollBy(0,scroll,true);
      var ele = document.getElementsByTagName("ion-content");  
      ele[0].style.overflow="auto";  //解决滑动右边的导航字母后，左边不能再滚动的bug，可以试着注释这两句来测试这个问题

    };

    $scope.mRelease=function(){
        $timeout(function(){
            $scope.showMiddle=false;
        },300); 
    };
    function loadData(){//从本地的一个包含全国各城市的json文件中加载数据
        $ionicLoading.show(); 
        $http.get("json/city.json").success(function(data) {
          $scope.cityDatas=data.dataList;
          $ionicLoading.hide();
        });
      } 

  //返回页面
  $scope.confirmCity = function(zoneCityId,zoneCity){
   // console.log(zoneCityId);
    console.log(zoneCity.substr(0,2));

    var waterObj={phsid:$scope.phsid,text:$scope.text,type:$scope.type,city:zoneCity.substr(0,2),message:$scope.message}
    var waterJsonObj= angular.toJson(waterObj);
    console.log(waterJsonObj)
    $state.go('jiaofeiRecord',{'waterJsonObj':waterJsonObj});
  }
}
angular.module("myapp")
        .controller("cityChangesCtrl",['$http','$stateParams','$location','$rootScope','$scope','$state','$filter','$ionicHistory','$ionicLoading','$ionicScrollDelegate',cityChangesCtrl]);