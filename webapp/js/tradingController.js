/*--------------------------------------交易明细-------------------------------------------------*/
function trading($scope,$rootScope,$location,$state,$stateParams){
	//设置支付金额
	function fmoney(s, n) { 
		n = n > 0 && n <= 20 ? n : 2; 
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
		var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1]; 
		t = ""; 
		for (i = 0; i < l.length; i++) { 
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
		} 
		return t.split("").reverse().join("") + "." + r; 
	} 
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
    //定义全局变量
   var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
	var publicStr=publicKey(str);
	var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}'
	var moneyStr=publicKey(mstr);
	
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
	
	//向detail页面传参      订单详情
	$scope.todetail = function (publicStr,moneyStr,detailStr){
    	$state.go('wrap.detail',{publicStr:publicStr,moneyStr:moneyStr,detailStr:detailStr});
    }
	//初始化生成日历
	$('#beginDate').glDatePicker();
	$('#endDate').glDatePicker();
	//点击查看交易明细
	$scope.searchList=function(){
		var begindate=$("#beginDate").val();
		var enddate=$("#endDate").val();
		if(begindate=="" || enddate==""){
			$("#mark_two").css("display","block").find(".text").text("日期不可为空");
			$(".change").off("click").on("click",function(){
				$("#mark_two").css("display","none");
			})
		}else{
			paging(1);
		}	 
	}
	//封装交易明细分页
	function page(pages){
		$(function(){
			$("#page").Page({
	          totalPages: pages,//分页总数
	          liNums: 7,//分页的数字按钮数(建议取奇数)
	          activeClass: 'activP', //active 类样式定义
	          callBack : function(page){
	        	  //console.log(page);
	        	  paging(page);
	          }
	      });
		});
	}
	//封装交易明细查看
	function paging(beginPos){
		var beginDate,endDate;
		if($("#beginDate").val().indexOf('-') > 0){
			beginDate=$("#beginDate").val().split("-");
			endDate=$("#endDate").val().split("-");
		}else{
			beginDate=$("#beginDate").val().split("/");
			endDate=$("#endDate").val().split("/");
		}
		(beginDate[1].length==1) && (beginDate[1]="0"+beginDate[1]) || (beginDate[1]=beginDate[1]);
		
		(beginDate[2].length==1) && (beginDate[2]="0"+beginDate[2]) || (beginDate[2]=beginDate[2]);
		
		(endDate[1].length==1) && (endDate[1]="0"+endDate[1]) || (endDate[1]=endDate[1]);
			
		(endDate[2].length==1) && (endDate[2]="0"+endDate[2]) || (endDate[2]=endDate[2]);
	
		beginDate=beginDate.join("");
		endDate=endDate.join("");
		//console.log(beginDate);
		//console.log(endDate);
		//选择交易状态
		var state=$("#choise option:selected").text();
		
		var parms = {};
		parms.customerNo = $scope.customerNo;
		parms.sessionId = $scope.sessionId;
		parms.beginDate = beginDate;
		parms.endDate = endDate;
		parms.beginPos = beginPos;
		parms.pageSize="5";
		$.ajax({
			url :getRootPath()+"/TransactionQueryAction.transactionOrderQuery.do?FAPView=JSON",
			type:'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.transactionOrderList.result.length==0){
							$(".listTwo").css("display","none");
							$("#sorry").css("display","block");
							$(".trading_main ").css("border","none");
						}else{
							if(beginPos==1){
								page(parseInt(data.data.transactionOrderList.pages));
							}
							$(".listTwo").css("display","block")
							$("#sorry").css("display","none");
							$(".trading_main ").css("border","1px solid #ccc");
							$scope.tradingList=data.data.transactionOrderList.result;
							$scope.$apply();
							//循环判断交易类型及交易金额
							for(var i=0;i<$scope.tradingList.length;i++){
								$scope.trxAmount=fmoney($scope.tradingList[i].trxAmount, 2);
								if($scope.tradingList[i].orderStatus=="1"){
									$scope.state="交易成功";
								}else if($scope.tradingList[i].orderStatus=="2"){
									$scope.state="交易失败";
								}else{
									$scope.state="交易处理中";
								}
								$(".listTwo").eq(i).find(".trxAmount").text($scope.trxAmount);
								$(".listTwo").eq(i).find(".state").text($scope.state);
							}
						}
					}else{
						$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
						$(".change").off("click").on("click",function(){
							$("#mark_two").css("display","none");
						})
					}
				}else if(data.FAPStatus==2){
					$("#mark_two").css("display","block").find(".text").text("请重新登录");
					$(".change").off("click").live("click",function(){
			    		$("#mark_two").css("display","none");
			    		window.location.href="./index.html";
			    	})
				}else{
					$("#mark_two").css("display","block").find(".text").text(data.FAPErrorMessage);
					$(".change").off("click").on("click",function(){
						$("#mark_two").css("display","none");
					})
				}
			},
			error : function(){
				//location = "index.html";
			}
		});
	}
	
	$(".detail").off("click").live("click",function(){
		var orderSerialNo=$(this).parents(".listTwo").find(".tradingNum").text();
		var parms = {};
		parms.customerNo = $scope.customerNo;
		parms.sessionId = $scope.sessionId;
		parms.orderSerialNo = orderSerialNo;
		$.ajax({
			url :getRootPath()+"/TransactionQueryAction.transactionOrderDetailQuery.do?FAPView=JSON",
			type:'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						var time=data.data.transactionOrderDetail.createTime;
						//console.log(time)
						$scope.createTime=time.substr(0,4)+"年"+time.substr(4,2)+"月"+time.substr(6,2)+"日"+time.substr(8,2)+":"+time.substr(10,2);//创建时间
						$scope.orderNo=data.data.transactionOrderDetail.orderNo;//订单号
						$scope.trxAmount=fmoney(data.data.transactionOrderDetail.trxAmount, 2);//交易金额
						$scope.transactionType=data.data.transactionOrderDetail.transactionType;//订单类型
						$scope.merchName=data.data.transactionOrderDetail.payCstName+" "+data.data.transactionOrderDetail.transactionType+" 到 "+data.data.transactionOrderDetail.rcvCstName;//订单信息
						if(data.data.transactionOrderDetail.orderStatus=="1"){
							$scope.states="交易成功";
						}else if(data.data.transactionOrderDetail.orderStatus=="2"){
							$scope.states="交易失败";
						}else{
							$scope.states="交易处理中";
						}
						$scope.$apply();
						var tstr='{"createTime":"'+$scope.createTime+'","orderNo":"'+$scope.orderNo+'","trxAmount":"'+$scope.trxAmount+'","transactionType":"'+$scope.transactionType+'","merchName":"'+$scope.merchName+'","states":"'+$scope.states+'"}'
						var detailStr=publicKey(tstr);
						$scope.todetail(publicStr,moneyStr,detailStr);
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
			error : function(){
				//location = "index.html";
			}
		})
	})
	//点击清空交易明细
	$scope.clear=function(){
		$("#beginDate").val("");
		$("#endDate").val("");
		$(".trading_main ul li").not(":first").remove();
	}
	//点击返回按钮
	$(".back").off("click").live("click",function(){
		$scope.toMain(publicStr);
	})
	$(".change").off("click").on("click",function(){
		$("#mark_two").css("display","none");
	})
};
angular.module("myapp")
		.controller("trading",["$scope","$rootScope","$location","$state","$stateParams",trading]);