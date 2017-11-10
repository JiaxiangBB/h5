function phoneRechargeRecordsCtrl($scope,$ionicModal){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");
	//手机充值记录列表图标
	$(".phoneRechargeRecords .one img").attr("src",imgRrc+"h5images/icon_xiaofei"+variable+".png");
	$(".phoneRechargeRecords .two img").attr("src",imgRrc+"h5images/icon_shenghuojiaofei_record"+variable+".png");

	//没有记录时的背景图
	$(".empty img").attr("src",imgRrc+"h5images/icon_wujilu@3x.png");
	//定义时间参数
	var date = new Date();
	$scope.beginDate=getNowFormatDate(date.getFullYear()-1);//开始时间
	$scope.endDate=getNowFormatDate(date.getFullYear());//结束时间


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
        get_goods_list(_arguments, {'customerNo':$scope.customerNo, 'sessionId':$scope.sessionId, 'beginDate':$scope.beginDate,'endDate':$scope.endDate,'page':page_no,limit:page_size,'orderBy':'4','selectMark':'SJ'},function(data){
            var data=$.parseJSON(data);
           // console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					if(data.data.orderTradeList.length==0){
						$(".empty").show().siblings().hide();
					}else{
						$scope.lists=data.data.orderTradeList;
						$scope.message($scope.lists);
						$(".empty").hide().siblings().show();
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
			}
        },function(data,status){
			console.log(data);
		});
    });

    $scope.doRefresh = function(){
    	page_no           = 1;
    	$scope.noMorePage=false;
    	$(".list").html("");
        get_goods_list(_arguments, {'customerNo':$scope.customerNo, 'sessionId':$scope.sessionId, 'beginDate':$scope.beginDate,'endDate':$scope.endDate,'page':page_no,limit:page_size,'orderBy':'4','selectMark':'SJ'},function(data){
            var data=$.parseJSON(data);
            //console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					if(data.data.orderTradeList.length==0){
						$(".empty").show().siblings().hide();
					}else{
						$scope.lists=data.data.orderTradeList;
						$scope.message($scope.lists);
						$(".empty").hide().siblings().show();
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
			}
			$scope.$broadcast('scroll.refreshComplete');
        },function(data,status){
			console.log(data);
		});
    };

    $scope.loadMore = function(){
        page_no+= 1;
        $(".list").html("");
        get_goods_list(_arguments, {'customerNo':$scope.customerNo, 'sessionId':$scope.sessionId, 'beginDate':$scope.beginDate,'endDate':$scope.endDate,'page':page_no,limit:page_size,'orderBy':'4','selectMark':'SJ'} ,function(data){
            var data=$.parseJSON(data);
            //console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					var length = data.data.orderTradeList.length;
					if(length<10){
			            $scope.noMorePage=true;
			            if(length==0){
			            	$(".empty").show().siblings().hide();
			            }
			        }
	            	for (var i=0;i<length;i++)
		            {
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
				loginH5Host();//从新调登录接口
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
			$scope.day.push(new Date(day).getDay());
			//console.log(day)
			if($scope.day[i]==1){$scope.week="周一"}else if($scope.day[i]==2){$scope.week="周二"}else if($scope.day[i]==3){$scope.week="周三"}
			else if($scope.day[i]==4){$scope.week="周四"}else if($scope.day[i]==5){$scope.week="周五"}else if($scope.day[i]==6){$scope.week="周六"}
			else if($scope.day[i]==7){$scope.week="周日"}
			//支付状态
			$scope.state=lists[i].orderStatus;
			//支付金额
			$scope.trxAmount=fmoney(lists[i].trxAmout,2)
			//判断图标
			$scope.img=imgRrc+"h5images/icon_shoujirecharge"+variable+".png";
			$scope.transactionType="手机充值";
			$(".list").append(
				"<li>"
					+"<span class='one'><img src='"+$scope.img+"'></span>"
					+"<p>"
						+"<label>－"+$scope.trxAmount+"</label>"
						+"<i>"+$scope.transactionType+$scope.trxAmount+"元</i>"
					+"</p>"
					+"<b>"+$scope.week+"<br>"+lists[i].createTime.substr(0,10)+"</b>"
					+"<em style='color: #FC5050;''>"+$scope.state+"</em>"
				+"</li>"
			)
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
		.controller("phoneRechargeRecordsCtrl",['$scope','$ionicModal',phoneRechargeRecordsCtrl]);