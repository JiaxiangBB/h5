function couponsCtrl($scope,$ionicHistory,$ionicModal){
	//$ionicLoading.show();//显示加载指示器
	//公共参数
	$scope.customerNo=getURLParameter("customerNo");
	$scope.sessionId=localStorage.getItem("data");//sessionId
	//console.log($scope.sessionId);

	$("#coupons-view .couponsList li").css("background-image","url("+imgRrc+"h5images/icon_quan_canused"+variable+".png)");
	$(".couponsTab span").off("click").on("click",function(){
		$(".couponsList ul").eq($(this).index()).css("display","block").siblings().css("display","none");
		var item=$(this).index();
		$(this).siblings("p").css("left",1.28*item+"rem");//点击切换下划线left改变
		var status="";
		if(item==0){//可使用
			$("#couponsCanuse").html("");
			status="01";
			firstCouponQurey(1,status);
			$("#coupons-view .couponsList li").css("background-image","url("+imgRrc+"h5images/icon_quan_canused"+variable+".png)").find(".time span").css("color","#E53D1F").siblings("label").find("b").css("background-color","#E53D1F");
		}else if(item==1){//已使用
			$("#couponsUsed").html("");
			status="02";
			firstCouponQurey(1,status);
			$("#coupons-view .couponsList li").css("background-image","url("+imgRrc+"h5images/icon_quan_yishiyong"+variable+".png)").find(".time span").css("color","#999").siblings("label").find("b").css("background-color","#999");
		}else{//已过期
			$("#couponsExpired").html("");
			status="99";
			firstCouponQurey(1,status);
			$("#coupons-view .couponsList li").css("background-image","url("+imgRrc+"h5images/icon_quan_yiguoqi"+variable+".png)").find(".time span").css("color","#999").siblings("label").find("b").css("background-color","#999");
		}
		
	});
	firstCouponQurey(1,"01");
	//优惠券查询
	function firstCouponQurey(beginPos,status){
		var parms={};
		parms.customerNo=$scope.customerNo;
		parms.sessionId=$scope.sessionId;
		parms.beginPos=beginPos;
		parms.pageSize=2;
		parms.status=status;
		//console.log(parms);
		$.ajax({
			url :getRootPath()+"/PublicPayAction.findCouponList.do?FAPView=JSON",
	 		data : parms,
	 		success : function(data) {
	 			var data=$.parseJSON(data);
	 			//console.log("-------优惠券--------");
	 			//console.log(data);
	 			if(data.FAPStatus==0){
	 				if(data.success==true){
	 					var couponList=data.data.couponList.result;
						var first="",used="",expired="",expiredate="",cdiIssdate="";
						var pages=data.data.couponList.pages;
						for(var i=0;i<couponList.length;i++){
							expiredate=couponList[i].expiredate;//活动结束日期
	 						cdiIssdate=couponList[i].cdiIssdate;//活动开始时期
	 						couponDirection = couponList[i].couponDirection;//活动具体信息
	 						couponFrom = couponList[i].couponFrom;;//
	 						if(status=="01"){
	 							//console.log(couponList[i].couponAmount);//优惠券金额
	 							$("#couponsCanuse").append('<li>'
	 								+'<p class="money">'
	 									+'<span><i>'+couponList[i].couponAmount+'</i>元</span>'
	 									+'<label>优惠券</label>'
									+'</p>'
	 								+'<p class="time">'
	  									+'<span>有效期：'+cdiIssdate+"-"+expiredate+'</span>'
	  									+'<label><b></b><em>'+couponDirection+'</em></label>'
	  									+'<big>来源：<i>'+couponFrom+'</i></big>'
	  								+'</p>'
	  							+'</li>')
	 							$("#coupons-view .couponsList li").css("background-image","url("+imgRrc+"h5images/icon_quan_canused"+variable+".png)").find(".time span").css("color","#E53D1F").siblings("label").find("b").css("background-color","#E53D1F");
	 						}else if(status=="02"){
								$("#couponsUsed").append('<li>'
	 								+'<p class="money">'
	 									+'<span><i>'+couponList[i].couponAmount+'</i>元</span>'
	 									+'<label>优惠券</label>'
									+'</p>'
	 								+'<p class="time">'
	  									+'<span>有效期：'+cdiIssdate+"-"+expiredate+'</span>'
	  									+'<label><b></b><em>'+couponDirection+'</em></label>'
	  									+'<big>来源：<i>'+couponFrom+'</i></big>'
	  								+'</p>'
	  							+'</li>')
	  							$("#coupons-view .couponsList li").css("background-image","url("+imgRrc+"h5images/icon_quan_yishiyong"+variable+".png)").find(".time span").css("color","#999").siblings("label").find("b").css("background-color","#999");
	 						}else{
	 							$("#couponsExpired").append('<li>'
	 								+'<p class="money">'
	 									+'<span><i>'+couponList[i].couponAmount+'</i>元</span>'
	 									+'<label>优惠券</label>'
									+'</p>'
	 								+'<p class="time">'
	  									+'<span>有效期：'+cdiIssdate+"-"+expiredate+'</span>'
	  									+'<label><b></b><em>'+couponDirection+'</em></label>'
	  									+'<big>来源：<i>'+couponFrom+'</i></big>'
	  								+'</p>'
	  							+'</li>')
	  							$("#coupons-view .couponsList li").css("background-image","url("+imgRrc+"h5images/icon_quan_yiguoqi"+variable+".png)").find(".time span").css("color","#999").siblings("label").find("b").css("background-color","#999");
	 						}
						};
	 				}else{
	 					$scope.msg = data.errors.msg;
					    $scope.openModalThree();
					    setTimeout(function(){
					        $scope.closeModalThree();
					    },1000*3);
	 				};
	 			}else if(data.FAPStatus==2){
	 				loginH5Host();//重新登录
	 			}else{
	 				$scope.msg = data.FAPErrorMessage;
				    $scope.openModalThree();
				    setTimeout(function(){
				        $scope.closeModalThree();
				    },1000*3);
	 			}
	 		},
	 		error:function(a,b,c){
	 			alert("错误")
	 		}
		});
	}

	//显示提示
	$(".couponsList li").off("click").on("click",function(){
		if($(".couponsTab p").css("left")=="0px"){
			$("#coupons-view .mask").show();
		}
	});
	$(".maskContent button").off("click").on("click",function(){
		$(this).parents(".mask").hide();
	});

	//modalThree弹框
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
		.controller("couponsCtrl",['$scope','$ionicHistory','$ionicModal',couponsCtrl]);