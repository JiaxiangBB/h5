function login($scope,$rootScope,$location,$state,$stateParams){
	$rootScope.preurl=getRootPath();
	$rootScope.imagesSRC="http://image.ohepay.com";
	$scope.test = function(){//可信网站
		var _kxs = document.createElement('script');
		_kxs.id = 'kx_script';
		_kxs.async = false;
		_kxs.setAttribute('cid', 'kx_verify');
		_kxs.src = ('https:' == document.location.protocol ? 'https://ss.knet.cn' : 'http://rr.knet.cn')+'/static/js/icon3.js?sn=e16121611010565791upiw000000&tp=icon3';
		_kxs.setAttribute('size', 2);
		var _kx = document.getElementById('kx_verify');
		_kx.parentNode.insertBefore(_kxs, _kx);
		
		var _aqs = document.createElement('script');//安全联盟
		_aqs.type="text/javascript";
		_aqs.async = false;
		_aqs.src ="//static.anquan.org/static/outer/js/aq_auth.js";
		var _aqx = document.getElementById('ppbVerify');
		_aqx.parentNode.insertBefore(_aqs,_aqx);
		
		/*var _smts = document.getElementsByClassName('smtk')[0];//赛门铁克
		var $_smts=$(_smts);
		$_smts.removeClass("smtk_wrap").addClass("smtk_login");*/
		
		var _smts = document.createElement('script');//赛门铁克
		_smts.type="text/javascript";
		_smts.src ='./js/base/try.js';
 		var _smtx = document.getElementById('smtVerify');
 		_smtx.parentNode.insertBefore(_smts, _smtx);
	};
	
	//向main.html页面传参数        
    $scope.toMain = function (publicStr){
    	$state.go('wrap.main', {publicStr: publicStr});
    };
	//手机端登录页面 接口 调整
	$(".phone_loginL").off("click").click(function(){
		$(".phonelogin-wrapform").css("display","block");
	});
	//登陆框关闭按钮
	$(".phonelogin-wrapform .close").off("click").click(function(){
		$(".phonelogin-wrapform").css("display","none");
	});	
	//卡余额查询
	$(".cardQurey").off("click").click(function(){
		$(".phone_cardBalance_query").css("display","block");
	});
	//余额查询 关闭按钮
	$(".phone_cardBalance_query .close").off("click").click(function(){
		$(".phone_cardBalance_query").css("display","none");
	});
	
	$scope.getInfo = function(){
      //点击商户登录 弹出登录弹框
      $(".login-wrap").css("display","block");
      //关闭登录弹框
      $(".login-title .close").off("click").click(function(){
        $(".login-wrap").css("display","none");
      });
	};

	$scope.cardBalance = function(){//: PrepaidCardAction.prepaidCardBalQuery "customerNo": @"sessionId" @"cardNo":@"cardPayPwd"   
		$(".cardBalance_query").css("display","block");//卡余额查询
		$(".cardBalance_query .close").off("click").click(function(){//关闭卡余额弹框
			$(".cardBalance_query").css("display","none");
		});
	};
	
	phoneLoginTap();//手机端 登录框适配 接口重新调一遍
	function phoneLoginTap(){
		$scope.phonelogin = function(){
			var mobile =  $(".phonelogin-wrapform #phone_number").val();//手机号
			var password = $(".phonelogin-wrapform #password").val();//密码
			var password_img = $(".phonelogin-wrapform #password_img").val();//图形验证码
			var parms = {};
			parms.loginType="2";//登录方式
			parms.userId=mobile;//用户ID
			parms.password=hex_md5(password);//密码加密
			/*parms.password=password;//密码*/										
			parms.validateCode = password_img;//图形验证码
			parms.channelType = "005";
			//会自动转码，适合表单参数多的时候
			$.ajax({
				url :getRootPath()+"/SystemAction.login.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							$(".phonelogin-wrapform .login-tip").css("display","none");
							var customerNo=data.data.customerNo;
							var lastMac=data.data.lastMac;
							var sessionId=data.data.sessionId;
							var payPwdFlag=data.data.payPwdFlag;
							var customerNameCN="";
							var mobile=data.data.mobile;
							var lastLogonTime_one=data.data.lastLogonTime.substr(4,2)+"-"+data.data.lastLogonTime.substr(6,2);
							var lastLogonTime_two=data.data.lastLogonTime.substr(8,2)+":"+data.data.lastLogonTime.substr(10,2);
							var lastLogonTime=lastLogonTime_one+" "+lastLogonTime_two;
							if(data.data.customerNameCN.length==11){
								customerNameCN="未实名";
							}else{
								customerNameCN=data.data.customerNameCN;
							}     
							var str='{"customerNo":"'+customerNo+'","sessionId":"'+sessionId+'","customerNameCN":"'+customerNameCN+'","mobile":"'+mobile+'","payPwdFlag":"'+payPwdFlag+'","password":"'+password+'","lastLogonTime":"'+lastLogonTime+'"}';
							var publicStr=publicKey(str);
							$scope.toMain(publicStr);
						}else{
							$(".phonelogin-wrapform .login-tip").css("display","block").text(data.errors.msg);
							//图片验证码
							$(".phonelogin-wrapform #pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
						}
					}else{
						$(".phonelogin-wrapform .login-tip").css("display","block").text(data.FAPErrorMessage);
						//图片验证码
						$(".phonelogin-wrapform #pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
					}
				},
				error:function(a,b,c){
					//alert("错误");
				}					
			});
		};
	};
	
	
	loginTap();
	//登陆提交
	function loginTap(){
		$scope.login = function(){
			var mobile =  $("#phone_number").val();//手机号
			var password = $("#password").val();//密码
			var password_img = $("#password_img").val();//图形验证码
			var parms = {};
			parms.loginType="2";//登录方式
			parms.userId=mobile;//用户ID
			parms.password=hex_md5(password);//密码加密
			/*parms.password=password;//密码*/										
			parms.validateCode = password_img;//图形验证码
			parms.channelType = "005";
			//会自动转码，适合表单参数多的时候
			$.ajax({
				url :getRootPath()+"/SystemAction.login.do?FAPView=JSON",
				type: 'post',
				data : parms,
				success : function(data) {
					var data=$.parseJSON(data);
					//console.log(data);
					if(data.FAPStatus==0){
						if(data.success==true){
							$(".login-tip").css("display","none");
							var customerNo=data.data.customerNo;
							var lastMac=data.data.lastMac;
							var sessionId=data.data.sessionId;
							var payPwdFlag=data.data.payPwdFlag;
							var customerNameCN="";
							var mobile=data.data.mobile;
							var lastLogonTime_one=data.data.lastLogonTime.substr(4,2)+"-"+data.data.lastLogonTime.substr(6,2);
							var lastLogonTime_two=data.data.lastLogonTime.substr(8,2)+":"+data.data.lastLogonTime.substr(10,2);
							var lastLogonTime=lastLogonTime_one+" "+lastLogonTime_two;
							if(data.data.customerNameCN.length==11){
								customerNameCN="未实名";
							}else{
								customerNameCN=data.data.customerNameCN;
							}
							var str='{"customerNo":"'+customerNo+'","sessionId":"'+sessionId+'","customerNameCN":"'+customerNameCN+'","mobile":"'+mobile+'","payPwdFlag":"'+payPwdFlag+'","password":"'+password+'","lastLogonTime":"'+lastLogonTime+'"}';
							var publicStr=publicKey(str);
							$scope.toMain(publicStr);
						}else{
							$(".login-tip").css("display","block").text(data.errors.msg);
							//图片验证码
							$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
						}
					}else{
						$(".login-tip").css("display","block").text(data.FAPErrorMessage);
						//图片验证码
						$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
					}
				},
				error:function(a,b,c){
					//alert("错误");
				}			
			});
		};
	};
	
	
	//图片验证码
  	$scope.changeImg = function(){
  		$("#pic_num").attr('src',getRootPath()+"/PublicAction.getRandomImgCode.do?FAPView=JSON?"+Math.random());
  	};
};

angular.module("myapp")
		.controller("login",["$scope","$rootScope","$location","$state","$stateParams",login]);