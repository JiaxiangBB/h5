/*--------------------------------------优惠券------------------------------------------------*/
function coupons($scope,$rootScope,$location,$state,$stateParams){
	//获取wrap页面的参数         
	//解析url参数     wrap页面    publicStr
	var obj="";
	var str = $stateParams.publicStr;
	if(str==""){
		
	}else{
		var privateStr=privateKey(str);
		obj=angular.fromJson(privateStr);
	}
	
   $scope.customerNo = obj.customerNo;
   $scope.sessionId = obj.sessionId; 
   $scope.mobile = obj.mobile;
   $scope.customerNameCN = obj.customerNameCN;
   $scope.payPwdFlag = obj.payPwdFlag;//是否设置支付密码
   $scope.password = obj.password;//登录密码
   $scope.lastLogonTime = obj.lastLogonTime;//最后一次登录时间
   //解析url参数    二级页面    moneyStr
   var mstr = $stateParams.moneyStr;
   var mprivateStr=privateKey(mstr);
   var mobj=angular.fromJson(mprivateStr);
   $scope.balance_wrap = mobj.balance_wrap;//转账页面显示 账户余额
   $scope.accountBalance = mobj.accountBalance;
   $scope.quanShiCard=mobj.quanShiCard;
   
   //定义全局变量
   var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
	var publicStr=publicKey(str);
	var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}'
	var moneyStr=publicKey(mstr);

	//点击弹框关闭按钮
	 $scope.close=function(){
		$("#mark_one").css("display","none");
		$("#mark_two").css("display","none");
	 };
	$(".change").off("click").on("click",function(){
		$("#mark_one").css("display","none");
		$("#mark_two").css("display","none");
	});
	
	//优惠券使用说明弹框
	$scope.constitution = function(){
		$("#markApply").css("display","block");
	}
	//弹框 关闭按钮
	$scope.closeadd = function(){
		$("#markApply").css("display","none");
	}
	//封装优惠券分页
	function page(pages,status){
		$(function(){
			$("#page").Page({
	          totalPages: pages,//分页总数
	          liNums: 7,//分页的数字按钮数(建议取奇数)
	          activeClass: 'activP', //active 类样式定义
	          callBack : function(page){
	        	  console.log(page);
	        	  firstCouponQurey(page,status);
	          }
	      });
		});
	};
	//点击导航 切换优惠券状态 couponsCanuse couponsUsed couponsExpired
	$(".couponsNav ul li").off("click").on("click",function(){
		$(this).css({"color":"#000","border-bottom":"2px solid #EA5532"}).siblings().css({"color":"#D8D8D8","border-bottom":"2px solid #D8D8D8"});
		$(".couponsAccessible ul").eq($(this).index()).css("display","block").siblings().css("display","none");
		var status="";
		if($(this).attr("class")=="firstCoupon"){
			status="01";
		}else if($(this).attr("class")=="usedCoupon"){
			status="02";
		}else{
			status="99";
		}
		firstCouponQurey(1,status)
	});
	//优惠券查询接口 
	firstCouponQurey(1,"01")
	function firstCouponQurey(beginPos,status){
		var parms={};
		parms.customerNo=$scope.customerNo;
		parms.sessionId=$scope.sessionId;
		parms.beginPos=beginPos;
		parms.pageSize=2;
		parms.status=status;
		//console.log(status);
		$.ajax({
			url :getRootPath()+"/PublicPayAction.findCouponList.do?FAPView=JSON",
			data : parms,
			success : function(data) {	
				var data=$.parseJSON(data);
				//console.log(data)
				if(data.FAPStatus==0){
					if(data.success==true){
						var couponList=data.data.couponList;
						var first="",used="",expired="",expiredate="",cdiIssdate="";
						var pages=data.data.couponList.pages;
						//console.log(pages+" "+status);
						if(beginPos==1){
							page(parseInt(pages),status);
						}
						for(var i=0;i<couponList.length;i++){
							expiredate=couponList[i].expiredate;
							cdiIssdate=couponList[i].cdiIssdate;
							if(status=="01"){
								//console.log(couponList[i].couponAmount);
								first+='<li>'
									+'<p>'
										+'<b class="moneyCoupon"><span>'+couponList[i].couponAmount+'</span><i>元</i></b>'
										+'<span class="detialCoupon"><a>使用</a><b class="detial">满<lable>'+couponList[i].couponUserRule+'</label>元可用</b></span>'
									+'</p>'
									+'<p id="introduce">'
										+'<span><b>限制品类：</b>'+couponList[i].couponDirection+'</span>'
										+'<span><b>使用有效期至：</b>'+cdiIssdate+"-"+expiredate+'</span>'
										+'<span><b>来源：</b>'+couponList[i].couponFrom+'</span>'
									+'</p>'
								+'</li>';
							}else if(status=="02"){
								used+='<li>'
									+'<p>'
										+'<b class="moneyCoupon"><span>'+couponList[i].couponAmount+'</span><i>元</i></b>'
										+'<span class="detialCoupon" style="display:none"><a>使用</a><b class="detial">满<lable>'+couponList[i].couponUserRule+'</label>元可用</b></span>'
									+'</p>'
									+'<p id="introduce">'
										+'<span><b>限制品类：</b>'+couponList[i].couponDirection+'</span>'
										+'<span><b>使用有效期至：</b>'+cdiIssdate+"-"+expiredate+'</span>'
										+'<span><b>来源：</b>'+couponList[i].couponFrom+'</span>'
									+'</p>'
								+'</li>';
							}else{
								expired+='<li>'
									+'<p>'
										+'<b class="moneyCoupon"><span>'+couponList[i].couponAmount+'</span><i>元</i></b>'
										+'<span class="detialCoupon" style="display:none"><a>使用</a><b class="detial">满<lable>'+couponList[i].couponUserRule+'</label>元可用</b></span>'
									+'</p>'
									+'<p id="introduce">'
										+'<span><b>限制品类：</b>'+couponList[i].couponDirection+'</span>'
										+'<span><b>使用有效期至：</b>'+cdiIssdate+"-"+expiredate+'</span>'
										+'<span><b>来源：</b>'+couponList[i].couponFrom+'</span>'
									+'</p>'
								+'</li>';
							}
						}
						$("#couponsCanuse").html(first);
						$("#couponsUsed").html(used);
						$("#couponsExpired").html(expired);
						
					}else{
						$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
					}
				}else if(data.FAPStatus==2){
					$("#mark_two").css("display","block").find(".text").text("请重新登录");
					$(".change").off("click").live("click",function(){
			    		$("#mark_two").css("display","none");
			    		window.location.href="./index.html";
			    	})
				}else{
					$("#mark_two").css("display","block").find(".text").text(data.FAPErrorMessage);
				}
			},
			error:function(a,b,c){
	//					alert("错误");
			}					
		});
	}
};
angular.module("myapp")
		.controller("coupons",["$scope","$rootScope","$location","$state","$stateParams",coupons]);