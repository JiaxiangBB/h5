function phoneRechargeCtrl($scope,$stateParams,$state,$ionicModal){
    //公共参数
    $scope.customerNo=getURLParameter("customerNo");
    $scope.sessionId=localStorage.getItem("data");//sessionId;
    //获取参数
    var queryParam = angular.fromJson($stateParams.josnObj);
    $scope.customerNameCN=queryParam.customerNameCN;//名字
    $scope.mobile=queryParam.mobileNo;//手机号
    $scope.certNo=queryParam.certNo;//身份证号

    $("#phoneRecharge-view .jinru_back").css("background-image","url("+imgRrc+"h5images/icon_jinru_black"+variable+".png)");

    $scope.information=false;//初始化充值信息
    $scope.flow=false;//充流量
    $scope.phoneList=false;//充话费
    $scope.informationTab=[{text:"充话费"},{text:"充流量"}];
    //输入手机号
    $(".phone").keyup(function(){
        var mobile=$(this).val();
        if(mobile.length==11){
            var rules_phone = /^1[34578][0-9]{9}$/;
            var isTel=rules_phone.test(mobile);
            if(isTel){
                $(".phoneRecharge span").show();
                $scope.phoneHuaFeiFun = function(){//手机话费
                    var parms = {};
                    parms.customerNo= $scope.customerNo;//客户号
                    parms.sessionId = $scope.sessionId;//ID  
                    parms.mobileNo=mobile;//手机号
                    $.ajax({
                        url :getRootPath()+"/ChargingPaymentAction.mobileRechargeProductQuery.do?FAPView=JSON",
                        type: 'post',
                        data : parms,
                        success : function(data) {
                            var data=$.parseJSON(data);
                            console.log(data);
                            if(data.FAPStatus==0){
                                if(data.success==true){
                                    $scope.information=true;
                                    $scope.phoneList=true;//充话费
                                    $scope.flow=false;//充流量
                                    $scope.areaName=data.data.areaName;// 省份
                                    $scope.carrierName=data.data.carrierName;//产品类别移动、联通、电信
                                    $(".prompt").text($scope.areaName+" "+$scope.carrierName).css("color","#333");
                                    $scope.mobileRecharge=data.data.mobileRechargeProductList;
                                    $scope.$apply();
                                               
                                }else{
                                $(".prompt").text(data.errors.msg).css("color","red");
                                }
                            }else if(data.FAPStatus==2){
                                loginH5Host();//从新调登录接口
                            }else{
                                $(".prompt").text(data.FAPErrorMessage).css("color","red");
                            }
                    
                        },
                        error:function(a,b,c){
                            alert("错误");
                        }                   
                    });
                };
                $scope.phoneHuaFeiFun();//调用手机话费充值
                $scope.phoneLiuLiangFun = function(){//手机流量充值函数
                    //手机流量充值接口接口
                    var parms = {};
                    parms.mark= "";//非必输，漫游类型 1：全国 2：本地
                    parms.mobileNo=mobile;//手机号
                    $.ajax({
                        url :getRootPath()+"/PhoneFlowProductInfAction.findPhoneFlowDataList.do?FAPView=JSON",
                        type: 'get',
                        data : parms,
                        success : function(data) {
                            var data=$.parseJSON(data);
                            console.log(data);
                            if(data.FAPStatus==0){
                                if(data.success==true){
                                    //手机流量产品列表
                                    $scope.phoneFlowList = data.data.mobileFlowProductList;
                                    console.log($scope.phoneFlowList);
                                    // console.log($("ul").index($(".$(.flowBox)")));
                                    // content    流量大小
                                    // istype  运营商   
                                    // productId   产品id     
                                    // provinceid  省份    
                                    // realprice   实际价格      
                                    // roamingType 漫游属性      全国为1，本地为2
                                    // sellprice   销售价格      按这个价格扣款
                                    // type    号码类型      移动、联通等
                                    // unit    单位    单位：
                                               
                                }else{
                                    $(".prompt").text(data.errors.msg).css("color","red");
                                }
                            }else if(data.FAPStatus==2){
                                 loginH5Host();//从新调登录接口
                            }else{
                                 $(".prompt").text(data.FAPErrorMessage).css("color","red");
                            }
                    
                        },
                        error:function(a,b,c){
                            alert("错误");
                        }                   
                    });
                }
                $scope.phoneLiuLiangFun();//调用手机流量函数
                //ul li 是否隐藏
                $scope.DetailLi = false;
                $scope.DetailLi02 = false;
                $scope.DetailLi03 = false;
                $scope.DetailLi04 = false;
                $scope.DetailLi05 = false;
                $scope.DetailLi06 = false;
                $scope.DetailLi07 = false;
                $scope.DetailLi08 = false;
                $scope.DetailLi09 = false;
                $scope.DetailLi10 = false;
                $scope.DetailLi11 = false;
                //箭头
                $("#phoneRecharge-view .phoneRecharge .flow .flowBox .flowTop .b1").css("background-image","url("+imgRrc+"h5images/flowUp"+variable+".png)");
                $("#phoneRecharge-view .phoneRecharge .flow .flowBox .flowTop .b2").css("background-image","url("+imgRrc+"h5images/flowDown"+variable+".png)"); 
                 
            }else{
                 $(".prompt").text("手机号格式错误").css("color","red");
            }
            
            // 点击选择充话费还是充流量
            $scope.choice=function(index){
                if(index==0){//充值话费
                    $(".informationTab p").css("left",0.52+"rem");
                    $scope.information=true;
                    $scope.flow=false;//充流量
                    $scope.phoneList=true;//充话费
                }else if(index==1){//冲流量
                    $(".informationTab p").css("left",2.15+"rem");
                    $scope.information=true;
                    $scope.flow=true;//充流量
                    $scope.phoneList=false;//充话费
                    //$scope.phoneLiuLiangFun();
                }
            };
        }
    });
    
    //点击充值话费
    //phoneType 1 代表手机话费充值 2代表手机流量充值
    $scope.phoneRechargeAmount=function(index){
        //点击当前元素样式
        $(".phoneList label").eq(index).addClass("hover").siblings().removeClass("hover");
        var money = $(".phoneList label").eq(index).find(".amount span").text(),//销售价格
        /*var money = 0.01,//测试缴费金额*/
            sellPrice = $(".phoneList label").eq(index).find(".price").text(),//缴费金额
            ppiId = $(".phoneList label").eq(index).find(".ppiId").text(),//产品Id
            areaName = $scope.areaName,// 省份
            carrierName = $scope.carrierName;//产品类别移动、联通、电信 
        var obj = {phoneType:1,mobile:$(".phone").val(),sellPrice:sellPrice,ppiId:ppiId,areaName:areaName,carrierName:carrierName,money:money,dataType:"4",payType:"5"};
        var jsonObj= angular.toJson(obj);

        $state.go("payWay",{'josnObj':jsonObj});
    };

    //手机流量充值  点击购买跳转到支付页面
    $scope.payFloW = function($event){
        var _t = $event;
        console.log(_t)
        //充值流量大小
        var flow = _t.currentTarget.children[3].innerHTML;
        //充值类型
        var type = _t.currentTarget.children[4].innerHTML;
        //充值金额
        var money =_t.currentTarget.firstElementChild.children[0].innerHTML;
        //充值产品ID
        var productId = _t.currentTarget.children[5].innerHTML;
        // console.log(_t.currentTarget.children[3].innerHTML);//2.13元北京流量仅限北京使用购买
        // console.log(flow)
        // console.log(type)
        // console.log(money)
        // console.log(productId)
        var obj = {phoneType:2,mobilePhone:$(".phone").val(),moneyFlow:money,ppiId:productId,flow:flow,type:type,dataType:"4",payType:"5"};
        var jsonObj= angular.toJson(obj);
        $state.go("payWay",{'josnObj':jsonObj});
    }
};
angular.module("myapp")
        .controller("phoneRechargeCtrl",['$scope','$stateParams','$state','$ionicModal',phoneRechargeCtrl]);