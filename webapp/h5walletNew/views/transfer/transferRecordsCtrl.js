function transferRecordsCtrl($scope,$ionicModal,$ionicLoading){
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");

	//没有记录时的背景图
	$(".empty img").attr("src",imgRrc+"h5images/icon_wujilu@3x.png");
	
	//定义时间参数
	var date = new Date();
	$scope.beginDate=getNowFormatDate(date.getFullYear()-1);//开始时间
	$scope.endDate=getNowFormatDate(date.getFullYear());//结束时间

	//调用转账记录
	var _arguments     = getRootPath()+"/TransactionQueryAction.transferOrderQuery.do?FAPView=JSON";
    $scope.lists       = [];
    var page_no           = 1;
    var page_size    = 10;
    $scope.noMorePage=false;
    $scope.day=[];
    $scope.$on('$ionicView.loaded', function(event, data) {
    	$(".list").html("");
    	$scope.noMorePage=false;
    	page_no = 1;
        get_goods_list(_arguments, {'customerNo':$scope.customerNo, 'sessionId':$scope.sessionId, 'beginDate':$scope.beginDate,'endDate':$scope.endDate,'beginPos':page_no,pageSize:page_size,'orderBy':"3"},function(data){
            var data=$.parseJSON(data);
            //console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					if(data.data.transferOrderList.result.length==0){
						$(".empty").show().siblings().hide();
					}else{
						$scope.lists=data.data.transferOrderList.result;
						$scope.message($scope.lists);
						//console.log($scope.lists)
						$(".empty").hide().siblings().show();
					}
				}else{
					//alert(data.errors.msg);
					$scope.msg =data.errors.msg;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			}else if(data.FAPStatus==2){
				loginH5Host();//从新调登录接口
			}else{
				//alert(data.FAPErrorMessage);
				$scope.msg =data.FAPErrorMessage;
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
    	$(".list").html("");
    	$scope.noMorePage=false;
    	page_no = 1;
        get_goods_list(_arguments, {'customerNo':$scope.customerNo, 'sessionId':$scope.sessionId, 'beginDate':$scope.beginDate,'endDate':$scope.endDate,'beginPos':page_no,pageSize:page_size,'orderBy':"3"},function(data){
            var data=$.parseJSON(data);
            console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					if(data.data.transferOrderList.result.length==0){
						$(".empty").show().siblings().hide();
					}else{
						$scope.lists=data.data.transferOrderList.result;
						$scope.message($scope.lists);
						$(".empty").hide().siblings().show();
					}
				}else{
					//alert(data.errors.msg);
					$scope.msg =data.errors.msg;
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
    	$(".list").html("");
        page_no += 10;
       // console.log(page_no)
        get_goods_list(_arguments, {'customerNo':$scope.customerNo, 'sessionId':$scope.sessionId, 'beginDate':$scope.beginDate,'endDate':$scope.endDate,'beginPos':page_no,pageSize:page_size,'orderBy':"3"} ,function(data){
            var data=$.parseJSON(data);
            //console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					var length = data.data.transferOrderList.result.length;
					if ( length<10){
	               		$scope.noMorePage=true;
	               		if(length==0){
			            	$(".empty").show().siblings().hide();
			            }
		            }
		            for (var  i=0;i<length;i++)
		            {
		                $scope.lists.push(data.data.transferOrderList.result[i]);
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
			var day=lists[i].createTime.substr(0,4)+"/"+lists[i].createTime.substr(4,2)+"/"+lists[i].createTime.substr(6,2);
			$scope.day.push(new Date(day).getDay());
			if($scope.day[i]==1){$scope.week="周一"}else if($scope.day[i]==2){$scope.week="周二"}else if($scope.day[i]==3){$scope.week="周三"}
			else if($scope.day[i]==4){$scope.week="周四"}else if($scope.day[i]==5){$scope.week="周五"}else if($scope.day[i]==6){$scope.week="周六"}
			else if($scope.day[i]==7){$scope.week="周日"}
			//支付状态
			$scope.trxAmount=fmoney(lists[i].amount, 2);
			if(lists[i].status=="1"){
				$scope.state="";
			}else if(lists[i].status=="2"){
				$scope.state="交易失败";
			}else{
				$scope.state="等待支付";
			}
			if(lists[i].payee){
				$scope.payee="-"+lists[i].payee;
			}else{
				$scope.payee="";
			}
			$scope.img=imgRrc+"h5images/icon_zhuanzhang"+variable+".png";
			$(".list").append(
				"<li>"
					+"<span class='one'><img src='"+$scope.img+"'></span>"
					+"<p>"
						+"<label>－"+$scope.trxAmount+"</label>"
						+"<i>"+lists[i].orderDesc+$scope.trxAmount+"元"+$scope.payee+"</i>"
					+"</p>"
					+"<b>"+$scope.week+"<br>"+lists[i].createTime.substr(4,2)+"-"+lists[i].createTime.substr(6,2)+"</b>"
					+"<em style='color: #FC5050;''>"+$scope.state+"</em>"
				+"</li>"
			)
		}
	};

	// 弹框
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
		.controller("transferRecordsCtrl",['$scope','$ionicModal','$ionicLoading',transferRecordsCtrl]);