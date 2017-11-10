function transactionDetailsCtrl($scope,$state,$stateParams,$ionicModal){
	//$ionicLoading.show();//显示加载指示器
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");

	//没有记录时的背景图
	$(".empty img").attr("src",imgRrc+"h5images/icon_wujilu@3x.png");
	//定义时间参数
	var date = new Date();
	$scope.beginDate = getNowFormatDate(date.getFullYear()-1);//开始时间
	$scope.endDate = getNowFormatDate(date.getFullYear());//结束时间
	//console.log($scope.beginDate);
	//console.log($scope.endDate);
	//
	//调用查询交易明细
	var _argumentsUrl = getRootPath()+"/AccountAction.accTradeQuery.do?FAPView=JSON";
	$scope.lists = [];
	$scope.day=[];//星期数组
	var page_no = 1;
	var page_size = 10;
	$scope.noMorePage = false;
	$scope.$on('$ionicView.loaded', function(event, data) {
		page_no = 1;
		$scope.noMorePage = false;
		$(".list").html("");
		//调用AJAX封装函数
		get_goods_list(_argumentsUrl, {'customerNo':$scope.customerNo,'sessionId':$scope.sessionId,'beginDate':$scope.beginDate,'endDate':$scope.endDate,'beginPos':page_no,pageSize:page_size,accType:'01',orderBy:'3',trsType:""},function(data){
            var data=$.parseJSON(data);
            console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					var accTradeList = data.data.accTradeList.result;//记录数
					if(accTradeList.length==0){
						$(".empty").show();
			 			$(".emptyTwo").hide();
						$(".empty img").attr("src",imgRrc+"h5images/icon_wujilu@3x.png");
					}else{
						//console.log(accTradeList);
		 				$scope.lists=accTradeList;
		 				$scope.message($scope.lists);//循环交易记录信息
		 				//$(".empty").hide().siblings().show();
					}
				}else{
					$scope.msg = data.errors.msg;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			}else if(data.FAPStatus==2){
				loginH5Host();
			}else{
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
	//封装循环信息
	$scope.message = function(lists){
		for(var i=0 ; i<lists.length; i++){
			//日期转换 20170727175158
			var day=lists[i].createTime.substr(0,4)+"/"+lists[i].createTime.substr(4,2)+"/"+lists[i].createTime.substr(6,2);
			//console.log(day);
			$scope.day.push(new Date(day).getDay());
			var curDay = new Date(day).getDay();
			//console.log($scope.day);
			if(curDay==1){$scope.week="周一"}else if(curDay==2){$scope.week="周二"}else if(curDay==3){$scope.week="周三"}else if(curDay==4){$scope.week="周四"}else if(curDay==5){$scope.week="周五"}else if(curDay==6){$scope.week="周六"}else if(curDay==0){$scope.week="周日"};
			//支付状态
			$scope.tradeAmount = fmoney(lists[i].amount,2);
			if(lists[i].tradeFlg=="0" || lists[i].tradeFlg=="1"){
				$scope.state="成功";
			}else{
				$scope.state="交易失败"
			}

			//判断图标
			var trsTypeSerialNo=lists[i].trsType;//trsType //tradeFlg 0
			var accountType = lists[i].accountType;//
			var tradeFlg = lists[i].tradeFlg;
			//console.log(trsTypeSerialNo);
			if(trsTypeSerialNo=="00"){//账户余额充值
				if(accountType == "03"){
					$scope.img=imgRrc+"h5images/icon_chongzhi"+variable+".png";
					$scope.transactionType="预付卡充值支出";
				}else if(accountType == "02"){
					$scope.img=imgRrc+"h5images/icon_chongzhi"+variable+".png";
					$scope.transactionType="余额充值";
				}else if(accountType == "01"){
					$scope.img=imgRrc+"h5images/icon_chongzhi"+variable+".png";
					$scope.transactionType="余额充值";
				}
			}else if(trsTypeSerialNo=="10"){//账户支付（消费）
				if(accountType == "03"){
					$scope.img=imgRrc+"h5images/icon_shoujirecharge"+variable+".png";
	 				$scope.transactionType="全时通卡消费支出";
				}else if(accountType == "02"){
					$scope.img=imgRrc+"h5images/icon_shoujirecharge"+variable+".png";
	 				$scope.transactionType="钱包充值";
				}else if(accountType == "01"){
					$scope.img=imgRrc+"h5images/icon_shoujirecharge"+variable+".png";
	 				$scope.transactionType="余额消费";
				}
			}else if(trsTypeSerialNo=="20"){//转账
				if(tradeFlg == "0"){
					$scope.img=imgRrc+"h5images/icon_zhuanzhang"+variable+".png";
	 				$scope.transactionType="转账-收入";
				}else{
					$scope.img=imgRrc+"h5images/icon_zhuanzhang"+variable+".png";
	 				$scope.transactionType="转账-转给别人";
				}	
			}else if(trsTypeSerialNo=="30"){//退款到账户

			}else if(trsTypeSerialNo=="60"){//提现

			}else if(trsTypeSerialNo=="41"){//消费

			}else if(trsTypeSerialNo=="42"){//消费撤销

			}else if(trsTypeSerialNo=="43"){//消费冲正

			}else if(trsTypeSerialNo=="40"){//全时通卡充值

			}else if(trsTypeSerialNo=="80"){//缴费		
				
			}else if(trsTypeSerialNo=="81"){//手机充值
				$scope.img=imgRrc+"h5images/icon_shoujirecharge"+variable+".png";
	 			$scope.transactionType="手机充值";
			}else if(trsTypeSerialNo=="82"){//生活缴费
				$scope.img=imgRrc+"h5images/icon_shenghuojiaofei_record"+variable+".png";
	 			$scope.transactionType="生活缴费";
			}else if(trsTypeSerialNo=="83"){//生活缴费
				$scope.img=imgRrc+"h5images/icon_shenghuojiaofei_record"+variable+".png";
	 			$scope.transactionType="手机流量充值";
			}

			//往List 追加 内容
			$(".list").append(
	 			"<li>"
	 				+"<span class='one'><img src='"+$scope.img+"'></span>"
	 				+"<p>"
	 					+"<label>"+$scope.tradeAmount+"</label>"
	 					+"<i>"+$scope.transactionType+$scope.tradeAmount+"元</i>"
	 				+"</p>"
	 				+"<b>"+$scope.week+"<br>"+lists[i].createTime.substr(4,2)+"-"+lists[i].createTime.substr(6,2)+"</b>"
	 				+"<em style='color: #FC5050;''>"+$scope.state+"</em>"
	 			+"</li>"
	 		);

		}
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

	//下拉刷新
	$scope.doRefresh = function(){
		page_no = 1;
		$scope.noMorePage=false;
		$(".list").html("");
		//调用AJAX封装函数
		get_goods_list(_argumentsUrl, {'customerNo':$scope.customerNo, 'sessionId':$scope.sessionId, 'beginDate':$scope.beginDate,'endDate':$scope.endDate,'beginPos':page_no,pageSize:page_size},function(data){
			var data = $.parseJSON(data);
			//console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					var accTradeList = data.data.accTradeList.result;//记录数
					if(accTradeList.length==0){
						$(".empty").show();
						$(".emptyTwo").hide()
					}else{
						//console.log(accTradeList);
		 				$scope.lists=accTradeList;
		 				$scope.message($scope.lists);//循环交易记录信息
		 				//$(".empty").hide().siblings().show();
					}
				}else{
					$scope.msg = data.errors.msg;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
				}
			}else if(data.FAPStatus==2){
				loginH5Host();//从新调登录接口
			}else{
				$scope.msg = data.FAPErrorMessage;
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
			}
	 		$scope.$broadcast('scroll.refreshComplete');
		},function(data){
			//console.log(data);
		});
	}
	//上拉加载
    $scope.loadMore = function(){
        page_no+= 10;
        $(".list").html("");
        get_goods_list(_argumentsUrl, {'customerNo':$scope.customerNo, 'sessionId':$scope.sessionId, 'beginDate':$scope.beginDate,'endDate':$scope.endDate,'beginPos':page_no,pageSize:page_size} ,function(data){
            var data=$.parseJSON(data);
           // console.log(data);
	 		if(data.FAPStatus==0){
	 			if(data.success==true){
	 				var length = data.data.accTradeList.result.length;
	 				if(length<10){
	 		            $scope.noMorePage=true;
	 		            if(length==0){
	 		            	$(".empty").hide();
							$(".emptyTwo").show()
	 		            }
	 		        }
	             	for (var i=0;i<length;i++){
	 	                $scope.lists.push(data.data.accTradeList.result[i]);
	 	            }
	 	            $scope.message($scope.lists);
	 	            $scope.$apply();
	 			}else{
	 				$scope.msg = data.errors.msg;
					$scope.openModalThree();
					setTimeout(function(){
						$scope.closeModalThree();
					},1000*3);
	 			}
	 		}else if(data.FAPStatus==2){
	 			loginH5Host();//从新调登录接口
	 		}else{
	 			$scope.msg = data.FAPErrorMessage;
				$scope.openModalThree();
				setTimeout(function(){
					$scope.closeModalThree();
				},1000*3);
	 		}
	 		$scope.$broadcast('scroll.infiniteScrollComplete');
        },function(data,status){
	 		//console.log(data);
	 	});
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
		.controller("transactionDetailsCtrl",['$scope','$state','$stateParams','$ionicModal',transactionDetailsCtrl]);
