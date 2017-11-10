function billListCtrl($scope,$stateParams,$http,$state,$ionicHistory,$ionicModal,$ionicLoading){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");

	//没有记录时的背景图
	
	
	//定义时间参数
	var date = new Date();
	$scope.beginDate=getNowFormatDate(date.getFullYear()-1);//开始时间
	$scope.endDate=getNowFormatDate(date.getFullYear());//结束时间
	//console.log($scope.beginDate);
	//console.log($scope.endDate);

	//调用查询交易明细
	var _arguments= getRootPath()+"/ThridPayAccountAction.myOrderTradeQuery.do?FAPView=JSON";
    $scope.lists= [];
    var page_no= 1;
  	var page_size = 10;
    $scope.noMorePage=false;
 	$scope.day=[];
	$scope.$on('$ionicView.loaded', function(event, data) {
		    page_no = 1;
		    $scope.noMorePage=false;
			$(".list").html("");
	    	get_goods_list(_arguments, {'customerNo':$scope.customerNo,'sessionId':$scope.sessionId,'beginDate':$scope.beginDate,'endDate':$scope.endDate,'limit':page_size,orderBy:4,page:page_no},function(data){
	        var data=$.parseJSON(data);
	       	console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					if(data.data.orderTradeList.length==0){
						$(".empty").show();
			 			$(".emptyTwo").hide();
						$(".empty img").attr("src",imgRrc+"h5images/icon_wujilu@3x.png");
					}else{
						$scope.lists=data.data.orderTradeList;
						$scope.message($scope.lists);
						//$scope.$digest();
						//$ionicHistory.clearCache();
						//$(".empty").hide().siblings().show();
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
				loginH5Host();//重新登录
			}else{
				//alert(data.FAPErrorMessage);
				$scope.msg = data.FAPErrorMessage;
			    $scope.openModalThree();
			    setTimeout(function(){
			        $scope.closeModalThree();
			    },1000*3);
			}
	    },function(data,status){
			//console.log(data);
		});
	});
	//下拉刷新
  	$scope.doRefresh = function(){
  		page_no = 1;
		$scope.noMorePage=false;
    	$(".list").html("");
 		get_goods_list(_arguments, {'customerNo':$scope.customerNo,'sessionId':$scope.sessionId,'beginDate':$scope.beginDate,'endDate':$scope.endDate,'limit':page_size,orderBy:4,page:page_no},function(data){
            var data=$.parseJSON(data);
          	console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					//alert("成功")
					if(data.data.orderTradeList.length==0){
						$(".empty").show();
						$(".emptyTwo").hide()
					}else{
						$scope.lists=data.data.orderTradeList;
						$scope.message($scope.lists);
						//$(".empty").hide().siblings().show();
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
				loginH5Host();//重新登录
			}else{
				//alert(data.FAPErrorMessage);
				$scope.msg = data.FAPErrorMessage;
			    $scope.openModalThree();
			    setTimeout(function(){
			        $scope.closeModalThree();
			    },1000*3);
			}
			$scope.$broadcast('scroll.refreshComplete');
        },function(data,status){
			console.log(data);
		});
    };
   	//上拉加载
  	$scope.loadMore = function(){
        page_no+= 10;
        $(".list").html("");
        get_goods_list(_arguments, {'customerNo':$scope.customerNo,'sessionId':$scope.sessionId,'beginDate':$scope.beginDate,'endDate':$scope.endDate,'limit':page_size,orderBy:4,page:page_no},function(data){
            var data=$.parseJSON(data);
            console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					var length = data.data.orderTradeList.length;
					if(length<10){
			            $scope.noMorePage=true;
			            if(length==0){
			            	$(".empty").hide();
							$(".emptyTwo").show()
			            }
			        }
	            	for (var i=0;i<length;i++){
		                $scope.lists.push(data.data.orderTradeList[i]);
		            }
		            $scope.message($scope.lists);
		            $scope.$apply();
				}else{
					//alert(data.errors.msg);
					$scope.msg = data.errors.msg;
				    $scope.openModalThree();
				    setTimeout(function(){
				        $scope.closeModalThree();
				    },1000*3);
				}
			}else if(data.FAPStatus==2){
				loginH5Host();//从新登录
			}else{
				//alert(data.FAPErrorMessage);
				$scope.msg = data.FAPErrorMessage;
			    $scope.openModalThree();
			    setTimeout(function(){
			        $scope.closeModalThree();
			    },1000*3);
			}
		 	$scope.$broadcast('scroll.infiniteScrollComplete');
  	    },function(data,status){
		 	console.log(data);
		});
  	};
	//封装ajax请求
	function get_goods_list(url, params, successfn,errorfn) {
        $.ajax({
        	url:url,
            type:'post',
            data: params,
            success: function(data){
            	successfn(data);
            },
            error: function(data,status){
                errorfn(data);
            }
        });
	};
	//封装循环信息
	$scope.message=function(lists){
		for(var i=0 ; i<lists.length; i++){
			//日期转换
			var day=lists[i].createTime.substr(0,4)+"/"+lists[i].createTime.substr(5,2)+"/"+lists[i].createTime.substr(8,2);
			//console.log(day)
			$scope.day.push(new Date(day).getDay());
			var curDay = new Date(day).getDay();
			
			//console.log(new Date(day).getDay());
			//if($scope.day[i]==1){$scope.week="周一"}else if($scope.day[i]==2){$scope.week="周二"}else if($scope.day[i]==3){$scope.week="周三"}else if($scope.day[i]==4){$scope.week="周四"}else if($scope.day[i]==5){$scope.week="周五"}else if($scope.day[i]==6){$scope.week="周六"}else if($scope.day[i]==7){$scope.week="周日"};
			if(curDay==1){$scope.week="周一"}else if(curDay==2){$scope.week="周二"}else if(curDay==3){$scope.week="周三"}else if(curDay==4){$scope.week="周四"}else if(curDay==5){$scope.week="周五"}else if(curDay==6){$scope.week="周六"}else if(curDay==0){$scope.week="周日"}
			//支付状态
			$scope.trxAmount=fmoney(lists[i].trxAmout, 2);
			//console.log(lists[i].trxAmout)
			if(lists[i].orderStatus=="成功"){
				$scope.state="交易成功";
			}else if(lists[i].orderStatus=="失败"){
				$scope.state="交易失败";
			}else{
				$scope.state="等待支付";
			}
			//判断图标
			var orderSerialNo=lists[i].orderType;
			if(orderSerialNo=="支付"){
				$scope.img=imgRrc+"h5images/icon_shoujirecharge"+variable+".png";
				$scope.transactionType="支付";
			}else if(orderSerialNo=="充值"){
				$scope.img=imgRrc+"h5images/icon_chongzhi"+variable+".png";
				$scope.transactionType="余额充值";
			}else if(orderSerialNo=="转账"){
				$scope.img=imgRrc+"h5images/icon_zhuanzhang"+variable+".png";
				$scope.transactionType="转账";
			}else if(orderSerialNo=="手机充值"){
				$scope.img=imgRrc+"h5images/icon_shoujirecharge"+variable+".png";
				$scope.transactionType="手机充值";
			}else if(orderSerialNo=="83"){
				$scope.img=imgRrc+"h5images/icon_shoujirecharge"+variable+".png";
				$scope.transactionType="手机流量充值";
			}else if(orderSerialNo=="生活缴费"){
				var remark = lists[i].remark;
				if(remark == "水费缴费"){
					$scope.img=imgRrc+"h5images/icon_life_water24"+variable+".png";
					$scope.transactionType="水费缴费";
				}else if(remark == "电费缴费"){
					$scope.img=imgRrc+"h5images/icon_life_electric24"+variable+".png";
					$scope.transactionType="电费缴费";
				}else{
					$scope.img=imgRrc+"h5images/icon_life_fire24"+variable+".png";
					$scope.transactionType="燃气缴费";
				};
			}
			$(".list").append(
				"<li>"
					+"<span class='one water'><img src='"+$scope.img+"'></span>"
					+"<p>"
						+"<label>－"+$scope.trxAmount+"</label>"
						+"<i>"+$scope.transactionType+$scope.trxAmount+"元</i>"
					+"</p>"
					+"<b>"+$scope.week+"<br>"+lists[i].createTime.substr(5,2)+"-"+lists[i].createTime.substr(8,2)+"</b>"
					+"<em style='color: #FC5050;''>"+$scope.state+"</em>"
				+"</li>"
			)
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
		.controller("billListCtrl",['$scope','$stateParams','$http','$state','$ionicHistory','$ionicModal','$ionicLoading',billListCtrl]);