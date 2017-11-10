function wrap($scope,$rootScope,$location,$state,$stateParams){
	$rootScope.preurl=getRootPath();
	//$rootScope.imagesSRC="http://image.ohepay.com/";
	$rootScope.imagesSRC="./build/";
	$scope.test_wrap = function(){
		var _kxs = document.createElement('script');
		_kxs.id = 'kx_script';
		_kxs.async = false;
		_kxs.setAttribute('cid', 'kw_verify');
		_kxs.src =('https:' == document.location.protocol ? 'https://ss.knet.cn' : 'http://rr.knet.cn')+'/static/js/icon3.js?sn=e16121611010565791upiw000000&tp=icon3';
		_kxs.setAttribute('size', 2);
		var _kx = document.getElementById('kw_verify');
		_kx.parentNode.insertBefore(_kxs, _kx);
		
		//安全联盟
		var _aqs = document.createElement('script');
		_aqs.src ="//static.anquan.org/static/outer/js/aq_auth.js";
		var _aqx = document.getElementById('ppbVerify');
		_aqx.parentNode.insertBefore(_aqs,_aqx);
		
		/*var _smts = document.getElementsByName('seal')[0];//赛门铁克
		var $_smts=$(_smts);
		$_smts.removeClass("smtk_login").addClass("smtk_wrap");*/
		
		var _smts = document.createElement('script');//赛门铁克
		_smts.type="text/javascript";
		_smts.src ='./js/base/try.js';
 		var _smtx = document.getElementById('smtVerify');
 		_smtx.parentNode.insertBefore(_smts, _smtx);
	};
	 //解析url参数 
	var obj="";
	var str = $stateParams.publicStr;
	if(str==""){
		obj="";
	}else{
		var privateStr=privateKey(str);
		obj=angular.fromJson(privateStr);
	}
	//console.log(obj)
    $scope.customerNo = obj.customerNo;
    $scope.sessionId = obj.sessionId; 
    $scope.mobile = obj.mobile;
    $scope.customerNameCN = obj.customerNameCN;
    $scope.payPwdFlag = obj.payPwdFlag;//是否设置支付密码
    $scope.password = obj.password;//登录密码
    $scope.lastLogonTime = obj.lastLogonTime;//最后一次登录时间
    //console.log($scope.customerNameCN)
    //定义全局变量
    var str='{"customerNo":"'+$scope.customerNo+'","sessionId":"'+$scope.sessionId+'","customerNameCN":"'+$scope.customerNameCN+'","mobile":"'+$scope.mobile+'","payPwdFlag":"'+$scope.payPwdFlag+'","password":"'+$scope.password+'","lastLogonTime":"'+$scope.lastLogonTime+'"}';
 	var publicStr=publicKey(str);
 	var mstr='{"accountBalance":"'+$scope.accountBalance+'","balance_wrap":"'+$scope.balance_wrap+'","quanShiCard":"'+$scope.quanShiCard+'"}';
 	var moneyStr=publicKey(mstr);
 	
 	//点击进入main
	$(".back").off("click").live("click",function(){
		var str = $stateParams.publicStr;
		var mstr = $stateParams.publicStr;
		$("button").removeAttr("disabled");//删除点击按钮禁止状态
		if(str=="" || mstr==""){
			window.location.href="./index.html";
		}else{
			//console.log(publicStr)
			$scope.toMain(publicStr);
		}
	});
	//点击返回按钮
	$(".toMain").off("click").live("click",function(){
		$scope.toMain(publicStr);
	});
  //向apply.html传参数 申请电子卡
    $scope.toApply = function (publicStr,moneyStr) {
        $state.go('wrap.apply', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向trading.html传参数  交易订单
    $scope.totrading = function (publicStr,moneyStr) {
        $state.go('wrap.trading', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向resetPsd.html传参数  忘记支付密码
    $scope.toresetPsw = function (publicStr,moneyStr) {
        $state.go('wrap.resetPsw', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向list.html传参数   全时通卡列表
    $scope.toList = function (publicStr,moneyStr) {
    	$state.go('wrap.list', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向listbank.html传参数    银行卡列表
    $scope.tolistBank = function (publicStr,moneyStr) {
        $state.go('wrap.listBank', {publicStr:publicStr,moneyStr:moneyStr});
    };  
  //向add.html传参数                      添加全时通卡                            
	$scope.toAdd = function (publicStr,moneyStr) {
        $state.go('wrap.add', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向addbank.html传参数         添加银行卡
    $scope.toaddBank = function (publicStr,moneyStr) {
        $state.go('wrap.addBank', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向recharge.html传参数          全时通卡充值
    $scope.toRecharge = function(publicStr,moneyStr,cardStr,cimg){
    	$state.go('wrap.recharge', {publicStr:publicStr,moneyStr:moneyStr,cardStr:cardStr,cimg:cimg});
    };
    //向prepaid.html传参数          账户充值
    $scope.toPrepaid = function(publicStr,moneyStr){
    	//alert("充值")
    	$state.go('wrap.prepaid', {publicStr:publicStr,moneyStr:moneyStr});
    };
    //向transfer.html传参数 转账
    $scope.toTransfer = function (publicStr,moneyStr){
    	$state.go('wrap.transfer', {publicStr:publicStr,moneyStr:moneyStr});
    };
    //向deposit.html页面传参数        提现
    $scope.toDeposit = function (publicStr,moneyStr){
    	$state.go('wrap.deposit', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向approve.html 立即认证传参数
    $scope.toapprove = function (publicStr,moneyStr){
    	$state.go('wrap.approve', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向payPassword.html 设置支付密码传参数
    $scope.topayPassword = function (publicStr,moneyStr){
    	$state.go('wrap.payPassword', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向safety.html 安全管理传参数
    $scope.tosafety = function (publicStr,moneyStr){
    	$state.go('wrap.safety', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向coupons.html传参数 优惠券
    $scope.toCoupons = function (publicStr,moneyStr) {
        $state.go('wrap.coupons', {publicStr:publicStr,moneyStr:moneyStr});
    };
  //向about.html页面传参数       关于我们
    $scope.toAbout = function (publicStr){
    	$state.go('wrap.about', {publicStr:publicStr});
    };
  //向help.html页面传参数        帮助中心
    $scope.toHelp = function (publicStr){
    	$state.go('wrap.help', {publicStr:publicStr});
    };
  //向guild.html页面传参数        新手指引
    $scope.toGuild = function (publicStr){
    	$state.go('wrap.guild', {publicStr:publicStr});
    };
  //向client.html页面传参数        客户端下载
    $scope.toClient = function (publicStr){
    	$state.go('wrap.client', {publicStr:publicStr});
    };
  //向main.html页面传参数        
    $scope.toMain = function (publicStr){
    	$state.go('wrap.main', {publicStr:publicStr});
    };
    //关于我们调用
    $scope.toabout=function(){
    	$scope.toAbout(publicStr);
    };
  //新手指引调用
    $scope.toguild=function(){
    	$scope.toGuild(publicStr);
    };
  //帮助中心调用
    $scope.tohelp=function(){
    	$scope.toHelp(publicStr);
    };
  //客户端下载调用
    $scope.toclient=function(){
    	$scope.toClient(publicStr);
    };
    //卡余额 查询 弹框开始
	$scope.markCardQurey = function(){
		$("#mark_cardQurey").css("display","block");
		$(".balance_form").css("display","block");
		$("#mark_cardQurey .cardpic").css("margin-left","0");
		$("#mark_cardQurey .cardNum").css("display","none");
		$("#mark_cardQurey .cardBalance").css("display","none");
	};
	//关闭弹框
	$scope.cardClose = function(){
		$("#mark_cardQurey").css("display","none");
		$("#errorMe").css("display","none");
		$(".cardNumber").val("");
		$(".cardPassword").val("");
	};
	$(".change").off("click").live("click",function(){
		$("#mark_one").css("display","none");
        $("#mark_two").css("display","none");
        $("#mark_search").css("display","none");
        $(".markRight").css("display","none");
        $(".SendPhoneMessage").removeAttr("disabled");//删除点击禁止事件
	});
	//点击弹框关闭按钮
    $scope.close=function(){
	   $("#mark_one").css("display","none");
       $("#mark_two").css("display","none");
       $("#mark_search").css("display","none");
       $(".markRight").css("display","none");
       $("#mark_registration").css("display","none");
   };
	//首页卡余额查询
	$scope.CardQurey = function(){
		var cardNumber = $(".cardNumber").val();//卡号
		var cardPassword = $(".cardPassword").val();//密码
		if(cardNumber==""){
			$("#errorMe").css("display","block").text("全时通卡号不可为空");
		}else{
			if(true){
				var parms = {};
				parms.customerNo= $scope.customerNo;//客户号
				parms.sessionId = $scope.sessionId;//ID
				parms.cardNo = cardNumber;//卡号
				parms.cardPayPwd = cardPassword;//密码
				$.ajax({
					url :getRootPath()+"/PrepaidCardAction.prepaidCardBalQuery.do?FAPView=JSON",
					type: 'post',
					data : parms,
					success : function(data) {
						var data=$.parseJSON(data);
						//console.log("---------卡余额查询--------");
						//console.log(data)
						if(data.FAPStatus==0){
        					if(data.success==true){
        						$(".balance_form").css("display","none");
        						$("#mark_cardQurey .cardpic").css("margin-left","160px");
        						$("#mark_cardQurey .cardNum").css("display","block");
        						$("#mark_cardQurey .cardBalance").css("display","block");
        						var balance = data.data.balance;
        						$(".cardBalance").text(balance);
        					}else{
        						$("#errorMe").css("display","block").text(data.errors.msg);
        					}
        				}else{
        					$("#errorMe").css("display","block").text(data.FAPErrorMessage);
        				}
						
					},
					error:function(a,b,c){
//						alert("错误");
					}					
				});
			}else{
				
			}
		}
	};
	if(obj==""){
		//登录调用
		 $scope.read_name=function(){
			 window.location.href="./index.html";
		 };
		$(".phone").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("请先登录");
	    	$(".change").text("登录");
	    });
	    $(".life").off("click").live("click",function(){
	    	$("#mark_one").css("display","block").find(".text").text("请先登录");
	    	$(".change").text("登录");
	    });
	    //点击弹框关闭按钮
	    $scope.close=function(){
		   $("#mark_one").css("display","none");
	       $("#mark_two").css("display","none");
	       $("#mark_search").css("display","none");
	    };
	}else{
		if($scope.customerNameCN=="未实名"){ 
	    	//实名认证调用
			 $scope.read_name=function(){
			    $scope.toapprove(publicStr,moneyStr);
			 };
		    $(".phone").off("click").live("click",function(){
		    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以进行手机充值操作");
		    	$(".change").text("立即认证");
		    });
		    $(".life").off("click").live("click",function(){
		    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以进行生活缴费操作");
		    	$(".change").text("立即认证");
		    });
		    //点击弹框关闭按钮
		    $scope.close=function(){
			   $("#mark_one").css("display","none");
		       $("#mark_two").css("display","none");
		       $("#mark_search").css("display","none");
		    };
		  }else{
			  //console.log($scope.payPwdFlag);
			  if($scope.payPwdFlag=="1"){
				  //判断总资产进行手机充值
				   $("#mark_one").css("display","none");
			       $("#mark_two").css("display","none");
			       $("#mark_search").css("display","none");
				    if($scope.accountBalance==0){
				    	$(".phone").off("click").live("click",function(){
					    	$("#mark_one").css("display","block").find(".text").text("抱歉，您的总资产为0，不能进行手机充值");
					    	$(".change").text("确定");
					    	$(".loss").css("display","none");
					    });
				    	$(".life").off("click").live("click",function(){
					    	$("#mark_one").css("display","block").find(".text").text("抱歉，您的总资产为0，不能进行生活缴费");
					    	$(".change").text("确定");
					    	$(".loss").css("display","none");
					    });
				    	$(".change").off("click").live("click",function(){
				    		$("#mark_one").css("display","none");
				    	});
				    }else{
					    $scope.show_phone_list=false;
					    $scope.show_life_list=false;
					  //点击显示手机充值
					    $scope.show_phone=function(){
					      $(".phone").off("click");
					      $(".markRight").css("display","none");
					      curCount=0;//当前剩余秒数
						  numBer=0;//判断是否显示重新获取
					      $(".wrap_right").css({"position":"relative","right":"30rem","top":"0"});
					      $(".right_list").css({"position":"absolute","right":"0","top":"0"});
					      $scope.show_phone_list=true;
					      $scope.show_life_list=false;
					      $scope.show_card_list=false;
					      $scope.show_money_pay=false;
					      $scope.show_list=true;
					      $(".SendPhoneMessage").removeAttr("disabled");//删除点击禁止事件
					      $(".right_list_header dd h2").text("手机充值 ");
					      $("#error").text("");
					      $("#phone_number").val("");
					      var strHtml="<a><li><h4>20元</h4></li></a><a><li><h4>30元</h4></li></a><a><li><h4>50元</h4></li></a><a><li><h4>100元</h4></li></a><a><li><h4>200元</h4></li></a><a><li><h4>300元</h4></li></a><a><li><h4>500元</h4></li></a>";
					      $("#phoneList").html(strHtml);
					    };
					  //点击显示生活缴费
					    $scope.show_life=function(){
					    	initialization();//初始化水电煤
					    	curCount=0;//当前剩余秒数
							numBer=0;//判断是否显示重新获取
							$(".surplus").remove();//生活缴费历史记录缓存删除
						    $(".wrap_right").css({"position":"relative","right":"30rem","top":"0"});
						    $(".right_list").css({"position":"absolute","right":"0","top":"0"});
						    $scope.show_life_list=true; 
						    $scope.show_phone_list=false;
						    $scope.show_card_list=false;
						    $(".right_list_header dd h2").text("生活缴费 ");
						    $(".unitNum").val("");
						    $(".payNum").val("");
						    $("#payPsd").val("");
						    $(".payLifeList").html("");
						    $(".paymentService").attr("checked",false);
						    $(".SendPhoneMessage").removeAttr("disabled");//删除点击禁止事件
						    $(".lifeList").css("display","block");
						    $(".paymentUnit").css("display","none");
						    $(".paymentList").css("display","none");
						    $(".rechargeMoney").css("display","none");
						    $(".paymentAccount").css("display","none");
						    $(".cityChoice").css("display","none");
						    $(".shortMessage").css("display","none").siblings(".payPawd").css("display","block");
						    $(".markRight").css("display","none");
						    first("selectp","selectc","form1",0,0);
						};
						//点击显示申请信用卡
						$scope.show_card=function(){
							curCount=0;//当前剩余秒数
							numBer=0;//判断是否显示重新获取
							$(".surplus").remove();//生活缴费历史记录缓存删除
						    $(".wrap_right").css({"position":"relative","right":"30rem","top":"0"});
						    $(".right_list").css({"position":"absolute","right":"0","top":"0"});
						    $scope.show_life_list=false; 
						    $scope.show_phone_list=false;
						    $scope.show_card_list=true;
						    $(".right_list_header dd h2").text("申请信用卡");
						};
						$scope.sed_ard = function(){
							window.location.href="https://ecentre.spdbccc.com.cn/creditcard/indexActivity.htm?data=P1479932";
						};
					    //点击关闭右侧栏
					    $scope.hide_right_list=function(){
					    	$(".wrap_right").css({"position":"relative","right":"0","top":"0"});
					    	$scope.show_phone_list=false; 
					    	$scope.show_life_list=false;
					    	$scope.show_card_list=false;
					    	/*$(".right_list_header dd h2").text("生活缴费 ");*/
					    	$(".payPhoneList").html("");
					    	$(".SendPhoneMessage").removeAttr("disabled");//删除点击禁止事件
					    };
				    }
			  }else{
				  	//设置支付密码调用
					 $scope.read_name=function(){
					    $scope.topayPassword(publicStr,moneyStr);
					 };
				    $(".phone").off("click").live("click",function(){
				    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以进行手机充值操作");
				    	$(".change").text("立即设置");
				    });
				    $(".life").off("click").live("click",function(){
				    	$("#mark_one").css("display","block").find(".text").text("实名认证并设置支付密码后才可以进行生活缴费 操作");
				    	$(".change").text("立即设置");
				    });
				    //点击弹框关闭按钮
				    $scope.close=function(){
					   $("#mark_one").css("display","none");
				       $("#mark_two").css("display","none");
				       $("#mark_search").css("display","none");
				   };
			  }		
		  }
	}
	     
    //添加银行卡调用
    $scope.add_banks=function(){
    	$scope.toaddBank(publicStr,moneyStr);
    	 //关闭右侧菜单
		 $(".wrap_right").css({"position":"relative","right":"0","top":"0"});
	      $scope.show_phone_list=false; 
	      $scope.show_life_list=false;
	      $(".payPhoneList").html("");
    };
    //忘记支付密码调用
	 $scope.forget_payPassword = function(){
		 $scope.toresetPsw(publicStr,moneyStr);
		 //关闭右侧菜单
		 $(".wrap_right").css({"position":"relative","right":"0","top":"0"});
	      $scope.show_phone_list=false; 
	      $scope.show_life_list=false;
	      $(".payPhoneList").html("");
	 };
	 //初始化全时钱包余额
	function walletBalance(){
		var parms = {};
		parms.customerNo= $scope.customerNo;//客户号
		$.ajax({
			url :getRootPath()+"/PrepaidCardAction.cardBalQuery.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						$(".accountBalance_wrap").text(fmoney(data.data.bankLists.avaAccountBalance,2));//总资产
						$(".balance_wrap").text(fmoney(data.data.bankLists.avaBalance,2));//账户余额
					}else{
						$(".markRight").css("display","block").find(".text").text(data.errors.msg);
					}
				}else if(data.FAPStatus==2){
					$(".markRight").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$(".markRight").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$(".markRight").css("display","block").find(".text").text(data.FAPErrorMessage);
				}
			},
			error:function(a,b,c){
//				alert("错误");
			}
			
		});
	};
	 
    //----------------------------------生活缴费---------------------------------
	//点击返回
	 //缴费单位返回至首页
	var rules_money =/^\d+(\.\d+)?$/;
	 $(".paymentUnit .backGo").off("click").on("click",function(){
		 $(".lifeList").css("display","block");
		 $(".paymentUnit").css("display","none");
		 $(".paymentList").css("display","none");
		 $(".rechargeMoney").css("display","none");
		 $(".paymentAccount").css("display","none");
		 $(".cityChoice").css("display","none");
		 $(".unitNum").val("");
	     $(".payNum").val("");
	     $("#payPsd").val("");
	     $(".payLifeList").html("");
	     $(".paymentService").attr("checked",false);
	     $(".surplus").remove();//生活缴费历史记录缓存删除
	 });
	 //信息查询返回至缴费单位
	 /*$(".paymentList .backGo").off("click").on("click",function(){
		 $(".lifeList").css("display","block");
		 $(".paymentUnit").css("display","none");
		 $(".paymentList").css("display","none");
		 $(".rechargeMoney").css("display","none");
		 $(".paymentAccount").css("display","none");
		 $(".cityChoice").css("display","none");
	 })*/
	 //支付方式返回至信息查询
	 $(".rechargeMoney .backGo").off("click").on("click",function(){
		 $(".lifeList").css("display","none");
		 $(".paymentUnit").css("display","none");
		 $(".paymentList").css("display","block");
		 $(".rechargeMoney").css("display","none");
		 $(".paymentAccount").css("display","none");
		 $(".cityChoice").css("display","none");
		 $(".payLifeList").html("");
		 $(".SendPhoneMessage").removeAttr("disabled");//删除点击禁止事件
		 curCount=0;//当前剩余秒数
		 numBer=0;//判断是否显示重新获取
		 $(".shortMessage").css("display","none").siblings(".payPawd").css("display","block");
	 });
	//点击切换城市
	 $(".switching").off("click").on("click",function(){
		 $(".lifeList").css("display","none");
		 $(".paymentUnit").css("display","none");
		 $(".paymentList").css("display","none");
		 $(".rechargeMoney").css("display","none");
		 $(".paymentAccount").css("display","none");
		 $(".cityChoice").css("display","block");
	 });
	 $(".cityChoice td").off("click").on("click",function(){
		 $(".switching i").text($(this).text());
		 $(".lifeList").css("display","block");
		 $(".paymentUnit").css("display","none");
		 $(".paymentList").css("display","none");
		 $(".rechargeMoney").css("display","none");
		 $(".paymentAccount").css("display","none");
		 $(".cityChoice").css("display","none");
	 });
	 $(".cityChoice .right_list_next").off("click").on("click",function(){
		 if($(".selectc option:selected").text()=="城市"){
			 $(".markRight").css("display","block").find(".text").text("请选择城市");
		 }else{
			 $(".switching i").text($(".selectc option:selected").text());
			 $(".lifeList").css("display","block");
			 $(".paymentUnit").css("display","none");
			 $(".paymentList").css("display","none");
			 $(".rechargeMoney").css("display","none");
			 $(".paymentAccount").css("display","none");
			 $(".cityChoice").css("display","none");
		 }
	 });	 
	//生活缴费初始化历史记录
	 function initialization(){
		 var parms={};
		 parms.customerNo=$scope.customerNo;//客户号
		 parms.sessionId=$scope.sessionId;//ID
		 $.ajax({
			url :getRootPath()+"/PayHydropowerSetupAction.findPayHydropowerSetupList.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data)
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.dianList.length == 0){
							$(".dianList").text("添加账号  >");
						}else{
							$(".dianList").text(">");
						}
						if(data.data.shuiList.length == 0){
							$(".shuiList").text("添加账号  >");
						}else{
							$(".shuiList").text(">");
						}
						if(data.data.meiList.length == 0){
							$(".meiList").text("添加账号  >");
						}else{
							$(".meiList").text(">");
						}
						 //点击添加账号或直接缴费
					    $(".lifeList li").off("click").on("click",function(){
					    	$(".right_list_header dd h2").text("生活缴费 | "+$(this).find("i").text());
					    	//缴费历史记录
					    	if($(this).find("span").text()==">"){
					    		if($(this).find("i").text()=="水费"){
						    		$scope.List=data.data.shuiList;
						    	}else if($(this).find("i").text()=="电费"){
						    		$scope.List=data.data.dianList;
						    	}else{
						    		$scope.List=data.data.meiList;
						    	}
					    		var html="";
					    		//console.log($scope.List.length)
						     	for(var i=0;i<$scope.List.length;i++){
									//历史记录追加
									html+='<li class="surplus">'
										+'<p class="payID"><span class="userNo">'+$scope.List[i].userNo+'</span>客户编号</p>'
										+'<p style="display:none" class="itemName">'+$scope.List[i].itemName+'</p>'
										+'<p><span>北京市朝阳区东三环</span>用户地址</p>'
										+'<p class="powerful"><a class="removeLifeList">删除记录</a><a class="payAgain">再次缴费</a></p>'
									 +'</li>';
								}
						     	$(".paymentAccount ul").prepend(html);
					    		 $(".lifeList").css("display","none");
							     $(".paymentUnit").css("display","none");
							     $(".paymentList").css("display","none");
							     $(".rechargeMoney").css("display","none");
							     $(".paymentAccount").css("display","block");
							     $(".cityChoice").css("display","none");
							     //生活缴费再次缴费
							     $(".payAgain").off("click").on("click",function(){
							     	//水电煤缴费账单查询 调用
							     	var unitNum=$(this).parent(".powerful").siblings(".payID").find("span").text();
							     	var cid,pid,picoid,protype,truename,receiverName;
							     	for(var i=0;i<$scope.List.length;i++){
							     		//水电煤缴费账单查询 参数
										if($(this).parents(".surplus").find('.userNo').text()==$scope.List[i].userNo){
											cid=$scope.List[i].cid;//城市id
											pid=$scope.List[i].pid;//省id
											picoid=$scope.List[i].picoid;//公司编号
											protype=$scope.List[i].protype;//产品类型
											truename=$scope.List[i].truename;//用户名
											receiverName=$scope.List[i].receiverName;//缴费单位
										}
							     	}
							     	$(".pUint").text(receiverName);
							     	paymentService(unitNum,pid,cid,picoid,protype,truename);
							     });
							     //删除历史记录
							     $(".removeLifeList").off("click").live("click",function(){
							    	 var ptdCustomerNo,ptdId;
							    	 for(var i=0;i<$scope.List.length;i++){
							     		//删除历史记录 参数
										if($(this).parents(".surplus").find('.userNo').text()==$scope.List[i].userNo){
											ptdCustomerNo=$scope.List[i].ptdCustomerNo;//用户编号
											ptdId=$scope.List[i].ptdId;//记录的Id
										}
							     	}
							    	//删除历史记录调用
									deleteHistory(ptdCustomerNo,ptdId);
							     });
					    	}else{//直接缴费
					    		 if($(this).find("i").text()=="水费"){
					    			 electric("/WaterCompanyAction.findWaterCompanyDataList.do?FAPView=JSON","水费");
					    		 }else if($(this).find("i").text()=="电费"){
					    			 electric("/ElectricityFeesCompanyAction.findElectricityFeesCompanyDataList.do?FAPView=JSON","电费");
					    		 }else{
					    			 electric("/CoalGasCompanyAction.findCoalgascompanyDataList.do?FAPView=JSON","燃气费");
					    		 }
					    		 $(".lifeList").css("display","none");
							     $(".paymentUnit").css("display","block");
							     $(".paymentList").css("display","none");
							     $(".rechargeMoney").css("display","none");
							     $(".paymentAccount").css("display","none");
							     $(".cityChoice").css("display","none");
					    	}
					    });
					}else{
						$(".markRight").css("display","block").find(".text").text(data.errors.msg);
					}
				}else if(data.FAPStatus==2){
					$(".markRight").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$(".markRight").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$(".markRight").css("display","block").find(".text").text(data.FAPErrorMessage);
				}
				
			},
			error:function(a,b,c){
//					alert("错误");
			}					
		});
	 };
	 //initialization();//初始化缴费历史记录
	 //删除历史记录封装（
	 function deleteHistory(ptdCustomerNo,ptdId){
		 var parms={};
		 parms.ptdCustomerNo=ptdCustomerNo;//用户编号
		 parms.ptdId=ptdId; //记录的Id
		 $.ajax({
				url :getRootPath()+"/PayHydropowerAccDetailAction.deletePayHydropowerAccDetail.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log(data)
					if(data.FAPStatus==0){
						if(data.success==true){
							$(".markRight").css("display","block").find(".text").text("缴费记录删除成功");
					    	$(".change").off("click").live("click",function(){
					    		//initialization();//初始化缴费历史记录
					    		$(".markRight").css("display","none");
					    	});
						}else{
							$(".markRight").css("display","block").find(".text").text(data.errors.msg);
						}
					}else if(data.FAPStatus==2){
						$(".markRight").css("display","block").find(".text").text("请重新登录");
				    	$(".change").off("click").live("click",function(){
				    		$(".markRight").css("display","none");
				    		window.location.href="./index.html";
				    	});
					}else{
						$(".markRight").css("display","block").find(".text").text(data.FAPErrorMessage);
					}
				},error:function(a,b,c){
//					alert("错误");
				}
		 });
	 }
    //初始化电费、水费、燃气费公司信息查询
    function electric(url,companyList){
    	var parms = {};
		parms.customerNo= $scope.customerNo;//客户号
		parms.sessionId = $scope.sessionId;//ID
		parms.cityName = $(".right_list_header p i").text();//城市
		$.ajax({
			url :getRootPath()+url,
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data)
				if(data.FAPStatus==0){
					if(data.success==true){
						if(companyList=="水费"){
							$scope.companyList=data.data.WaterCompanyList;
							$scope.$apply();
						}else if(companyList=="电费"){
							$scope.companyList=data.data.electricityFeesCompanyList;
							$scope.$apply();
						}else{
							$scope.companyList=data.data.coalGasCompanyList;
							$scope.$apply();   
						}
						
						//水电煤缴费账单查询 点击查询
					    $scope.pay=function(){
					    	if($("#ddlRegType").find("option:selected").text()=="请选择"){
								$(".markRight").css("display","block").find(".text").text("请选择缴费单位");
							}else{
								if($(".unitNum").val()!=""){
									if($(".paymentService").attr("checked")){
										$scope.pUint=$("#ddlRegType").find("option:selected").text();
										var unitNum=$(".unitNum").val();
										//循环水电燃的数据选择选中参数
										var pid,cid,picoid,protype,truename;
										for(var i=0;i<$scope.companyList.length;i++){
											if($('#ddlRegType option:selected').val()==$scope.companyList[i].companyName){
												cid=$scope.companyList[i].cityId;//城市id
												pid=$scope.companyList[i].provinceId;//省id
												picoid=$scope.companyList[i].companyNo;//公司编号
												protype=$scope.companyList[i].productType;//产品类型
												truename="";//用户名
											}
										}
										//水电煤缴费账单查询 调用
										paymentService(unitNum,pid,cid,picoid,protype,truename);
					    			}else{
					        			$(".markRight").css("display","block").find(".text").text("请先阅读全时钱包用户注册手续");
					        		}
					    		}else{
					        		$(".markRight").css("display","block").find(".text").text("请输入缴费账号");
					        	}
					    	}
					    };
					}else{
						$(".markRight").css("display","block").find(".text").text(data.errors.msg);
					}
				}else if(data.FAPStatus==2){
					$(".markRight").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$(".markRight").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$(".markRight").css("display","block").find(".text").text(data.FAPErrorMessage);
				}
				
			},
			error:function(a,b,c){
//				alert("错误");
			}					
		});
    }
    //水电煤缴费账单查询 封装
    function paymentService(unitNum,pid,cid,picoid,protype,truename){
    	$(".CustomerID").text(unitNum);
    	var date = new Date();
		var year=date.getFullYear(); 
		var month=date.getMonth()+1;
		if(parseInt(month)<10){
			month="0"+month;
		}
    	var yearmonth=year+month;
    	var parms = {};
		parms.customerNo= $scope.customerNo;//客户号
		parms.sessionId = $scope.sessionId;//ID
		parms.account = unitNum;//缴费账号	
		/*parms.account = "0123456856";//缴费账号*/		
		parms.yearmonth = yearmonth;//缴费日期
		parms.pid = pid;//省id
		parms.cid = cid;//城市id
		parms.picoid = picoid;//公司编号
		parms.protype = protype;//产品类型
		parms.truename = truename;//用户名
		$.ajax({
			url :getRootPath()+"/EsaiAction.eSaiPubQuery.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data)
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.result=="f"){
							$(".markRight").css("display","block").find(".text").text(data.data.errmsg);
						}else{
							//用户名
							if(data.data.truename){
								$(".truename").text(data.data.truename);
							}else{
								if(truename==""){
									$(".truename").text("默认");
								}else{
									$(".truename").text(truename);
								}
							}
							//账户金额
							if(data.data.bills){
								$(".bills").text(fmoney(data.data.bills,2));
							}else{
								$(".bills").text(fmoney(200,2));
							}
							//缴费账单日期
							if(data.data.yearmonth){
								yearmonth=data.data.yearmonth.substr(0,4)+"-"+data.data.yearmonth.substr(4,2);
								$(".yearmonth").text(yearmonth);
							}else{
								$(".yearmonth").text("2017-02");
							}
							$(".lifeList").css("display","none");
						     $(".paymentUnit").css("display","none");
						     $(".paymentList").css("display","block");
						     $(".rechargeMoney").css("display","none");
						     $(".paymentAccount").css("display","none");
						     $(".cityChoice").css("display","none");
						   //生活缴费方式
						     $scope.PaymentMethod=function(){
						     	if($(".payNum").val()==""){
						     		$(".markRight").css("display","block").find(".text").text("请输入缴费金额");
						     	}else{
						     		var isMoney = rules_money.test($(".payNum").val());
									if(isMoney){
										$(".lifeList").css("display","none");
							 		     $(".paymentUnit").css("display","none");
							 		     $(".paymentList").css("display","none");
							 		     $(".rechargeMoney").css("display","block");
							 		     $(".paymentAccount").css("display","none");
							 		     $(".cityChoice").css("display","none");
							 		     $("#phoneMoneyLife").text(fmoney($(".payNum").val()));
							 		    $("#payListPsd").val("");
							 		     var phoneMoney=$(".payNum").val();
							 		     var practice="",ppiId="",areaName="",carrierName="",truename=$(".truename").text();
							 		     rechargePay(phoneMoney,practice,ppiId,areaName,carrierName,picoid,pid,cid,truename,protype);
									}else{
										$(".markRight").css("display","block").find(".text").text("金额格式错误");
									}
						     	}
						     };
						}
					}else{
						$(".markRight").css("display","block").find(".text").text(data.errors.msg);
					}
				}else if(data.FAPStatus==2){
					$(".markRight").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$(".markRight").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$(".markRight").css("display","block").find(".text").text(data.FAPErrorMessage);
				}
				
			},
			error:function(a,b,c){
//				alert("错误");
			}					
		});
    }
  
    //生活缴费添加新账户
    $scope.addAccount=function(){
    	if($(".right_list_header").find("h2").text().indexOf("水费")>=0){
			 electric("/WaterCompanyAction.findWaterCompanyDataList.do?FAPView=JSON","水费");
		 }else if($(".right_list_header").find("h2").text().indexOf("电费")>=0){
			 electric("/ElectricityFeesCompanyAction.findElectricityFeesCompanyDataList.do?FAPView=JSON","电费");
		 }else{
			 electric("/CoalGasCompanyAction.findCoalgascompanyDataList.do?FAPView=JSON","燃气费");
		 }
    	$(".lifeList").css("display","none");
	     $(".paymentUnit").css("display","block");
	     $(".paymentList").css("display","none");
	     $(".rechargeMoney").css("display","none");
	     $(".paymentAccount").css("display","none");
	     $(".cityChoice").css("display","none");
    };
    //封装生活缴费获取短信
    function payLife(cardNo,payType,payPassword,picoid,pid,cid,truename,protype){
    	var date = new Date();
		var year=date.getFullYear(); 
		var month=date.getMonth()+1;
		if(parseInt(month)<10){
			month="0"+month;
		}
    	var yearmonth=year+month;
    	var str=$(".right_list_header h2").text();//手机充值或生活缴费
    	var itemName=str.substr(str.length-2);//缴费项目
    	var phsid;
    	if(itemName=="水费"){phsid=1}else if(itemName=="电费"){phsid=2}else{phsid=3};
    	var areaName=$(".switching i").text();//缴费区域
    	var receiverName=$('#ddlRegType option:selected').val();//公共事业单位名称
    	var userNo=$(".CustomerID").text();//水电煤卡号
    	var amount=$(".payNum").val();//金额
 
    	var parms = {},encryption;
    	/*if(cardNo==""){
    		encryption=amount+"&"+areaName+"&"+cid+"&"+$scope.customerNo+"&02&"+itemName+"&005&"+encryptByDES(payPassword)+"&"+payType+"&"+phsid+"&"+picoid+"&"+pid+"&"+protype+"&"+receiverName+"&"+truename+"&"+encryptByDES(userNo)+"&"+yearmonth;
    	}else if(payPassword==""){
    		encryption=amount+"&"+areaName+"&"+encryptByDES(cardNo)+"&"+cid+"&"+$scope.customerNo+"&02&"+itemName+"&005&" +payType+"&"+phsid+"&"+picoid+"&"+pid+"&"+protype+"&"+receiverName+"&"+truename+"&"+encryptByDES(userNo)+"&"+yearmonth;
    	}else{*/
    	encryption="amount="+amount+"&areaName="+areaName+"&cardNo="+encryptByDES(cardNo)+"&cid="+cid+"&customerNo="+$scope.customerNo+"&inOrderorgi=02&itemName="+itemName+"&payChannel=005&payPassword="+encryptByDES(payPassword)+"&payType="+payType+"&phsid="+phsid+"&picoid="+picoid+"&pid="+pid+"&protype="+protype+"&receiverName="+receiverName+"&truename="+truename+"&userNo="+encryptByDES(userNo)+"&yearmonth="+yearmonth;
    	/*}*/
		parms.customerNo=$scope.customerNo;
		parms.sessionId=$scope.sessionId;
		parms.areaName=areaName;//缴费区域
		parms.receiverName=receiverName;//公共事业单位名称
		parms.userNo=encryptByDES(userNo);//水电煤卡号
		parms.amount=amount;//金额
		parms.payType=payType;//支付类型
		parms.payChannel="005";//支付渠道
		parms.itemName=itemName;//缴费项目
		parms.inOrderorgi="02";//订单来源
		parms.picoid=picoid;//公司产品编号
		parms.pid=pid;//所属省或直辖市
		parms.cid=cid;//所属城市
		parms.truename=truename;//户主名字
		parms.yearmonth=yearmonth;//账单月份
		parms.cardNo=encryptByDES(cardNo);//支付卡号
		parms.protype=protype;//产品类型
		parms.phsid=phsid; 
		parms.payPassword=encryptByDES(payPassword);//支付密码
		parms.signKey=publicKeyRSA(md5(encryption));
		//console.log(encryption);
		//console.log(md5(encryption));
		$.ajax({
			url :getRootPath()+"/ChargingPaymentAction.publicPaymentCreateBill.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.payPaymentStatus==0){
							if(payType=="26"){
								sign();
								//点击提交
								var tranflow=data.data.tranflow;
								$scope.recharge_sub=function(){
									curCount=0;
									var tranflow=data.data.tranflow;
									var mobileCode=$("#shortMessageLife").val();
									//调用银行卡提交充值
									bankRechargeLife(cardNo,payType,payPassword,picoid,pid,cid,truename,protype,itemName,phsid,areaName,receiverName,userNo,amount,tranflow,mobileCode);
								};
							}else{
								$(".markRight").css("display","block").find(".text").text("生活缴费提交成功，等待到账");
						    	$(".change").off("click").live("click",function(){
						    		//initialization();//初始化缴费历史记录
						    		walletBalance();//初始化全时钱包余额
						    		$(".markRight").css("display","none");
						    	});
							}
						}else{
							if(payType=="26"){
								$(".markRight").css("display","block").find(".text").text("获取验证码失败");
						    	$(".change").off("click").live("click",function(event){
						    		event.stopPropagation();
						    		$(".markRight").css("display","none");
						    		$(".SendPhoneMessage").removeAttr("disabled");//删除点击禁止事件
						    	});
							}else{
								$(".markRight").css("display","block").find(".text").text("生活缴费提交失败");
						    	$(".change").off("click").live("click",function(){
						    		$(".markRight").css("display","none");
						    	});
							}
						}
					}else{
						$(".markRight").css("display","block").find(".text").text(data.errors.msg);
					}
				}else if(data.FAPStatus==2){
					$(".markRight").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$(".markRight").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$(".markRight").css("display","block").find(".text").text(data.FAPErrorMessage);
				}
				
			},
			error:function(a,b,c){
//				alert("错误");
			}					
		});
    }
  //封装银行卡提交充值
	function bankRechargeLife(cardNo,payType,payPassword,picoid,pid,cid,truename,protype,itemName,phsid,areaName,receiverName,userNo,amount,tranflow,mobileCode){
		var date = new Date();
		var year=date.getFullYear(); 
		var month=date.getMonth()+1;
		if(parseInt(month)<10){
			month="0"+month;
		}
    	var yearmonth=year+month;
    	var encryption="amount="+amount+"&areaName="+areaName+"&cardNo="+encryptByDES(cardNo)+"&cid="+cid+"&customerNo="+$scope.customerNo+"&inOrderorgi=02&itemName="+itemName+"&mobileCode="+encryptByDES(mobileCode)+"&payChannel=005&payType="+payType+"&picoid="+picoid+"&pid="+pid+"&protype="+protype+"&receiverName="+receiverName+"&tranFlowNo="+tranflow+"&truename="+truename+"&userNo="+encryptByDES(userNo)+"&yearmonth="+yearmonth;
		var parms={};
		parms.customerNo=$scope.customerNo;
		parms.sessionId=$scope.sessionId;
		parms.areaName=areaName;//缴费区域
		parms.receiverName=receiverName;//公共事业单位名称
		parms.userNo=encryptByDES(userNo);//水电煤卡号
		parms.amount=amount;//金额
		parms.payType=payType;//支付类型
		parms.payChannel="005";//支付渠道
		parms.itemName=itemName;//缴费项目
		parms.inOrderorgi="02";//订单来源
		parms.picoid=picoid;//公司产品编号
		parms.pid=pid;//所属省或直辖市
		parms.cid=cid;//所属城市
		parms.truename=truename;//户主名字
		parms.yearmonth=yearmonth;//账单月份
		parms.cardNo=encryptByDES(cardNo);//支付卡号
		parms.protype=protype;//产品类型
		parms.mobileCode=encryptByDES(mobileCode); //短信验证码
		parms.tranFlowNo=tranflow;//订单号
		parms.signKey=publicKeyRSA(md5(encryption));
		//console.log(encryption);
		//console.log(md5(encryption));
		$.ajax({
			url :getRootPath()+"/ChargingPaymentAction.publicPaymentCreateBillConfirm.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.payPaymentStatus=="0"){
							$(".markRight").css("display","block").find(".text").text("生活缴费提交成功，等待到账");
					    	$(".change").off("click").live("click",function(){
					    		$(".markRight").css("display","none");
					    		$(".wrap_right").css({"position":"relative","right":"0","top":"0"});
							    $scope.show_phone_list=false; 
							    $(".payCardlist_card").html("");
					    	});
						}else{
							$(".markRight").css("display","block").find(".text").text(data.data.errMsg);
						}
					}else{
						$(".markRight").css("display","block").find(".text").text(data.errors.msg);
					}
				}else if(data.FAPStatus==2){
					$(".markRight").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$(".markRight").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$(".markRight").css("display","block").find(".text").text(data.FAPErrorMessage);
				}
				
			},
			error:function(a,b,c){
//				alert("错误");
			}					
		});
	}
	/*全时钱包自助缴费协议*/
	$scope.walletPayment=function(){
		$("#mark_registration").css("display","block");
	};
     //--------------------------------------手机充值 ---------------------
    //点击返回
    $scope.backGo=function(){
    	$scope.show_money_pay=false;
	    $scope.show_list=true;
	    curCount=0;//当前剩余秒数
		numBer=0;//判断是否显示重新获取
    };
    //输入手机号显示样式
    $("#phone_number").blur(function(){
    	var strHtml="<a><li><h4>20元</h4></li></a><a><li><h4>30元</h4></li></a><a><li><h4>50元</h4></li></a><a><li><h4>100元</h4></li></a><a><li><h4>200元</h4></li></a><a><li><h4>300元</h4></li></a><a><li><h4>500元</h4></li></a>";
    	var mobile=$(this).val();
    	var rules_phone = /^1[34578][0-9]{9}$/;
        var isTel=rules_phone.test(mobile); 
        if(mobile==""){
        	$("#error").text("手机号不可为空").css("color","red");
        	$("#phoneList").html(strHtml);
    	}else{
    		if(isTel==true){
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
        				//console.log(data);
        				if(data.FAPStatus==0){
        					if(data.success==true){
        						var areaName=data.data.areaName;
        						var carrierName=data.data.carrierName;
        						$("#error").text(areaName+" "+carrierName).css("color","#333");
        						$scope.mobileRecharge=data.data.mobileRechargeProductList;
        						var str="";
        						for(var i=0;i<$scope.mobileRecharge.length;i++){
        							str+='<a><li><h4><i style="display:none">'+$scope.mobileRecharge[i].ppiId+'</i><b>'+$scope.mobileRecharge[i].parValue+'</b>元</h4><p>售价<label>'+$scope.mobileRecharge[i].price+'</label>元</p></li></a>';
        						}
        						$("#phoneList").html(str).find("h4").css({"color":"#000","line-height":"2.5rem"});
        						$("#phoneList").find("a").hover(function(){
        						    $(this).addClass("hover").find("h4").css("color","#fff");
        						},function(){
        							$(this).removeClass("hover").find("h4").css("color","#000");
        						});
        						phoneList(areaName,carrierName);
        					}else{
        						$("#error").text(data.errors.msg).css("color","red");
        						$("#phoneList").html(strHtml);
        					}
        				}else if(data.FAPStatus==2){
        					$(".markRight").css("display","block").find(".text").text("请重新登录");
        			    	$(".change").off("click").live("click",function(){
        			    		$(".markRight").css("display","none");
        			    		window.location.href="./index.html";
        			    	});
        				}else{
        					$("#error").text(data.FAPErrorMessage).css("color","red");
        					$("#phoneList").html(strHtml);
        				}
        				
        			},
        			error:function(a,b,c){
        				//        	alert("错误");
        			}					
        		});
    		}else{
    			$("#error").text("手机号格式错误").css("color","red");
    			$("#phoneList").html(strHtml);
    		}
    	}
    });
    //点击充值金额
    var phoneMoney="";//充值金额
    var practice="";//实际付款
    var ppiId="";
    function phoneList(areaName,carrierName){
    	$("#phoneList a").off("click").live("click",function(){
        	if($(this).find("p").text()==""){
            	return;
            }else{
            	$(this).addClass("hover").unbind('hover').find("h4").css("color","#fff");
            	$(this).siblings("a").removeClass("hover").hover(function(){
    			    $(this).addClass("hover").find("h4").css("color","#fff");
    			},function(){
    				$(this).removeClass("hover").find("h4").css("color","#000");
    			}).find("h4").css("color","#000");
            	phoneMoney=$(this).find("b").text();
            	practice=$(this).find("label").text();
            	ppiId=$(this).find("i").text();
            	//点击手机充值下一步
    		    $scope.show_money=function(){
    		    	$scope.show_money_pay=true;
    		      	$scope.show_list=false;
    		      	$(".shortMessage").css("display","none").siblings(".payPawd").css("display","block");
    		      	$("#phoneMoney").text(fmoney(practice));
    		      	$(".payPhoneList").html("");
    		      	$("#payPsd").val("");
    		      	//充值方式调用
    		      	var picoid,pid,cid,truename,protype;
    		      	rechargePay(phoneMoney,practice,ppiId,areaName,carrierName,picoid,pid,cid,truename,protype);
    		    };
            }
        });
    }
    
    //封装初始化充值方式
    function rechargePay(phoneMoney,practice,ppiId,areaName,carrierName,picoid,pid,cid,truename,protype){
    	 var parm = {};
		parm.customerNo = $scope.customerNo;//客户号
		$.ajax({
			url :getRootPath()+"/PrepaidCardAction.cardQuery.do?FAPView=JSON",
			type: 'post',
			data : parm,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log("------充值按钮 支付方式-------");
				//console.log(data);
				var bankcard_list = data.data.bankcard;
				var cdcard_list = data.data.cdcard;
				if(practice==""){
					for(var i=0;i<bankcard_list.length;i++){
						var CARDNAME = bankcard_list[i].CARDNAME //银行卡类型
						var bankcardNo = bankcard_list[i].ACCOUNTNO//卡号
						var BANKNAME = bankcard_list[i].BANKNAME;
						var img="";
						img=bankCard(BANKNAME,img);
						var interceptBank = bankcardNo.substring(6,bankcardNo.length-4);//截取卡号中间9位
						var ACCOUNTNO = bankcardNo.substr(0,6)+interceptBank.replace(interceptBank,"*********")+bankcardNo.substr(bankcardNo.length-4,4);
						$(".payLifeList").prepend('<h3>'
								+'<input type="radio" name="payCard" value="'+bankcardNo+'"></input>'
								+'<img src="'+img+'">'
								+'<span>'+ACCOUNTNO+'</span>'
						+'</h3>');
					}
					$(".payLifeList").prepend('<h3>'
							+'<input type="radio" name="payCard" value=""></input>'
							+'<img src="'+$rootScope.imagesSRC+'balance/zhifu_03.png">'
							+'<span>账户余额(元):<label>'+data.data.avabalance+'</label></span>'
					+'</h3>');
					$(".payLifeList>h3:first").find("input").attr("checked","checked");//默认第一个input选中
				}else{
					for(var i=0;i<bankcard_list.length;i++){
						var CARDNAME = bankcard_list[i].CARDNAME; //银行卡类型
						var bankcardNo = bankcard_list[i].ACCOUNTNO;//卡号
						var BANKNAME = bankcard_list[i].BANKNAME;
						var img="";
						img=bankCard(BANKNAME,img);
						var interceptBank = bankcardNo.substring(6,bankcardNo.length-4);//截取卡号中间9位
						var ACCOUNTNO = bankcardNo.substr(0,6)+interceptBank.replace(interceptBank,"*********")+bankcardNo.substr(bankcardNo.length-4,4);
						$(".payPhoneList").prepend('<h3>'
								+'<input type="radio" name="payCard" value="'+bankcardNo+'"></input>'
								+'<img src="'+img+'">'
								+'<span>'+ACCOUNTNO+'</span>'
						+'</h3>');
					}
					$(".payPhoneList").prepend('<h3>'
							+'<input type="radio" name="payCard" value=""></input>'
							+'<img src="'+$rootScope.imagesSRC+'balance/zhifu_03.png">'
							+'<span>账户余额(元):<label>'+data.data.avabalance+'</label></span>'
					+'</h3>');
					$(".payPhoneList>h3:first").find("input").attr("checked","checked");//默认第一个input选中
				}
				$(".payCardlist>h3").off("click").on("click",function(){
					$(this).find("input").attr("checked","checked").siblings().find("input").attr("checked","");
				});
				//调用点击提交
				var isClick=false;  //判断按钮是否被点击
				$(".payCardlist h3").off("click").on("click",function(){
					curCount=0;//当前剩余秒数
					numBer=0;//判断是否显示重新获取
					isClick=true;
					var payType="";
					var cardHao=$('input[name="payCard"]:checked').val();
					var payPassword="";
					if(cardHao==""){
						$(".shortMessage").css("display","none").siblings(".payPawd").css("display","block");
						if(data.data.avabalance<practice){//钱包余额充值
							$(".markRight").css("display","block").find(".text").text("账户余额不足");
					    	$(".change").off("click").on("click",function(event){
					    		event.stopPropagation();//禁止触发里面其他事件
					    		$(".markRight").css("display","none");    
					    	})
						}else{
							$scope.recharge_sub=function(){//点击提交
								payType="01";
								if(practice==""){
									var cardNo=$('input[name="payCard"]:checked').val();
									var phsid="";
									payPassword=$("#payListPsd").val();
									//生活缴费的钱包余额支付及短信验证码
									payLife(cardNo,payType,payPassword,picoid,pid,cid,truename,protype);
								}else{
									payPassword=$("#payPsd").val();
									//手机充值的钱包余额支付及短信验证码
									paySubmit(payType,cardHao,phoneMoney,practice,ppiId,areaName,carrierName,payPassword);
								}
							}
						}
					}else{
						var money=$('input[name="payCard"]:checked').next().next("span").find("label").text();
						if(money==""){//银行卡充值
							$(".shortMessage").css("display","block").siblings(".payPawd").css("display","none");
							$("#shortMessage").val("");
							$("#shortMessageLife").val("");
							$(".sign_next_again").css("display","inline-block").text("点击获取").next().css("display","none");
							$(".sign_time").text("59");
							payType="26";
							//发送短信验证码
							$(".SendPhoneMessage").off("click").on("click",function(){
								$(this).attr('disabled',"true");
								if(practice==""){
									var cardNo=$('input[name="payCard"]:checked').val();
									var phsid="";
									payPassword="";
									//生活缴费的钱包余额支付及短信验证码
									payLife(cardNo,payType,payPassword,picoid,pid,cid,truename,protype);
								}else{
									payPassword="";
									//手机充值的钱包余额支付及短信验证码
									paySubmit(payType,cardHao,phoneMoney,practice,ppiId,areaName,carrierName,payPassword);
								}
							});
							
						}
					}
				});
				//默认全时钱包充值
				$scope.recharge_sub=function(){
					$(".shortMessage").css("display","none").siblings(".payPawd").css("display","block");
					var payType="01";
					var cardHao=$('input[name="payCard"]:checked').val();
					var payPassword="";
					if(isClick==false){
						if(data.data.avabalance<practice){//钱包余额充值
							$(".markRight").css("display","block").find(".text").text("账户余额不足");
					    	$(".change").off("click").on("click",function(event){
					    		event.stopPropagation();
					    		$(".markRight").css("display","none");
					    	});
						}else{
							if(practice==""){
								var cardNo="";
								var phsid="";
								payPassword=$("#payListPsd").val();
								//console.log(payPassword)
								payLife(cardNo,payType,payPassword,picoid,pid,cid,truename,protype);
							}else{
								payPassword=$("#payPsd").val();
								paySubmit(payType,cardHao,phoneMoney,practice,ppiId,areaName,carrierName,payPassword);
							}
						}
					}
				};
				
			},error:function(){
				//alert("错误");
			}
		});
    }
    
    //封装点击提交钱包余额手机充值及银行卡手机充值的短信验证码
    function paySubmit(payType,cardHao,phoneMoney,practice,ppiId,areaName,carrierName,payPassword){
    	var parm = {},encryption;
    	/*if(cardHao==""){
    		encryption=phoneMoney+"&"+areaName+"&"+carrierName+"&"+$scope.customerNo+"&"+encryptByDES($("#phone_number").val())+"&005&"+encryptByDES(payPassword)+"&"+payType+"&"+ppiId+"&"+practice;
    	}else if(payPassword==""){
    		encryption=phoneMoney+"&"+areaName+"&"+encryptByDES(cardHao)+"&"+carrierName+"&"+$scope.customerNo+"&"+encryptByDES($("#phone_number").val())+"&005&"+payType+"&"+ppiId+"&"+practice;
    	}else{*/
    	encryption="amount="+phoneMoney+"&areaName="+areaName+"&cardNo="+encryptByDES(cardHao)+"&carrierName="+carrierName+"&customerNo="+$scope.customerNo+"&mobileNo="+encryptByDES($("#phone_number").val())+"&paychannel=005&payPassword="+encryptByDES(payPassword)+"&payType="+payType+"&ppiId="+ppiId+"&sellPrice="+practice;
    	/*}*/
		parm.customerNo = $scope.customerNo;//客户号
		parm.sessionId = $scope.sessionId;//令牌号
		parm.mobileNo = encryptByDES($("#phone_number").val());//手机号
		parm.amount =phoneMoney;//缴费金额
		parm.sellPrice = practice;//销售价格
		parm.payType = payType;//支付类型
		parm.cardNo = encryptByDES(cardHao);//支付卡号
		parm.ppiId = ppiId;//产品Id
		parm.areaName = areaName;// 省份
		parm.carrierName = carrierName;//产品类别移动、联通、电信 
		parm.payPassword = encryptByDES(payPassword);// 支付密码
		parm.paychannel="005";//代表pc
		parm.signKey=publicKeyRSA(md5(encryption));
		//console.log(encryption);
		//console.log(md5(encryption));
		$.ajax({
			url :getRootPath()+"/ChargingPaymentAction.mobileRechargeCreateBill.do?FAPView=JSON",
			type: 'post',
			data : parm,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.payPaymentStatus==0){
							if(payType=="26"){
								sign();
								//点击提交
								var tranflow=data.data.tranflow;
								$scope.recharge_sub=function(){
									curCount=0;
									//调用银行卡提交充值
									bankRecharge(payType,cardHao,phoneMoney,practice,tranflow,ppiId);
								};
							}else{
								$(".markRight").css("display","block").find(".text").text("手机充值提交成功，等待到账");
						    	$(".change").off("click").live("click",function(){
						    		walletBalance();//初始化全时钱包余额
						    		$(".markRight").css("display","none");
						    	});
							}
						}else{
							if(payType=="26"){
								$(".markRight").css("display","block").find(".text").text("获取验证码失败");
						    	$(".change").off("click").live("click",function(event){
						    		event.stopPropagation();
						    		$(".markRight").css("display","none");
						    		$(".SendPhoneMessage").removeAttr("disabled");//删除点击禁止事件
						    	});
							}else{
								if(data.data.errMsg){
									$(".markRight").css("display","block").find(".text").text(data.data.errMsg);
								}else{
									$(".markRight").css("display","block").find(".text").text("手机充值提交失败");
								}
						    	$(".change").off("click").live("click",function(){
						    		$(".markRight").css("display","none");
						    		$(".SendPhoneMessage").removeAttr("disabled");//删除点击禁止事件
						    	});
							}
						}
					}else{
						$(".markRight").css("display","block").find(".text").text(data.errors.msg);
				    	$(".change").off("click").live("click",function(){
				    		$(".markRight").css("display","none");
				    	});
					}
				}else if(data.FAPStatus==2){
					$(".markRight").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$(".markRight").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$(".markRight").css("display","block").find(".text").text(data.FAPErrorMessage);
			    	$(".change").off("click").live("click",function(){
			    		$(".markRight").css("display","none");
			    	});
				}
			},
			error:function(a,b,c){
				//alert("错误");
			}					
		});
    }
    //封装银行卡提交手机充值
    function bankRecharge(payType,cardHao,phoneMoney,practice,tranflow,ppiId){
    	var encryption="amount="+phoneMoney+"&cardNo="+encryptByDES(cardHao)+"&customerNo="+$scope.customerNo+"&mobileNo="+encryptByDES($("#phone_number").val())+"&payType="+payType+"&ppiId="+ppiId+"&sellPrice="+practice+"&tranFlowNo="+tranflow+"&verificationCode="+encryptByDES($("#shortMessage").val());
    	var parm = {};
    	//console.log(encryption);
    	//console.log(md5(encryption));
		parm.customerNo = $scope.customerNo;//客户号
		parm.sessionId = $scope.sessionId;//令牌号
		parm.mobileNo = encryptByDES($("#phone_number").val());//手机号
		parm.amount =phoneMoney;//缴费金额
		parm.sellPrice = practice;//销售价格
		parm.payType = payType;//支付类型
		parm.cardNo = encryptByDES(cardHao);//支付卡号
		parm.tranFlowNo = tranflow;//交易流水号
		parm.ppiId = ppiId;//产品ID
		parm.verificationCode = encryptByDES($("#shortMessage").val());//短信验证码
		parm.signKey=publicKeyRSA(md5(encryption));
		$.ajax({
			url :getRootPath()+"/ChargingPaymentAction.mobileRechargeConfirm.do?FAPView=JSON",
			type: 'post',
			data : parm,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						if(data.data.payPaymentStatus==0){
							$(".markRight").css("display","block").find(".text").text("手机充值提交成功，等待到账");
					    	$(".change").off("click").live("click",function(){
					    		$(".markRight").css("display","none");
					    	});
						}else{
							if(data.data.errMsg){
								$(".markRight").css("display","block").find(".text").text(data.data.errMsg);
							}else{
								$(".markRight").css("display","block").find(".text").text("手机充值提交失败");
							}
					    	$(".change").off("click").live("click",function(){
					    		$(".markRight").css("display","none");
					    	});
						}
					}else{
						$(".markRight").css("display","block").find(".text").text(data.errors.msg);
				    	$(".change").off("click").live("click",function(){
				    		$(".markRight").css("display","none");
				    	});
					}
				}else if(data.FAPStatus==2){
					$(".markRight").css("display","block").find(".text").text("请重新登录");
			    	$(".change").off("click").live("click",function(){
			    		$(".markRight").css("display","none");
			    		window.location.href="./index.html";
			    	});
				}else{
					$(".markRight").css("display","block").find(".text").text(data.FAPErrorMessage);
			    	$(".change").off("click").live("click",function(){
			    		$(".markRight").css("display","none");
			    	});
				}
			},
			error:function(a,b,c){
				//alert("错误");
			}					
		});
    };
    /*手机端底部应用*/
    $(".phoneLifePay").off("click").live("click",function(){
    	$(".phoneLifePay").css("display","none");
    	$(".phoneLifePayCost").css("display","block");
    });
    $(".phoneLifePayCost li").off("click").live("click",function(){
    	$(".phoneLifePayCost li").css("display","none");
    	$(".phoneLifePay").css("display","block");
    });
};

angular.module("myapp")
		.controller("wrap",["$scope","$rootScope","$location","$state","$stateParams",wrap]);