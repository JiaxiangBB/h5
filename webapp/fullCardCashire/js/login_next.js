;(function($){
	//显示手机号  解析参数
	var url = window.location.search;
	var str = url.substr(1);
	var privateStr="?"+privateKey(str);
	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(privateStr)||[,""])[1].replace(/\+/g, '%20'))||null;
	};
	var tel=getURLParameter("tel"),
		psw=getURLParameter("psw"),
		login_money=getURLParameter("login_money"),
		orderNo=getURLParameter("orderNo"),
		mallId=getURLParameter("mallId"),
		notifyUrl=getURLParameter("notifyUrl");
	//console.log(psw);
	$(function(){
		$(".sign_next_p").find("span").text(tel);
	}());
	//支付密码验证
	function isPsw_two() {
		var psw = $('#sign_psw2').val();
	    var rules = /^\d{6}$/;
	    return rules.test(psw);
	};
	//封装手机验证码   
	var sign_phone="";
	function auto(func){
   	 	var parms = {};
			parms.mobileNo=encryptByDES(tel);
			parms.validateType=1;
	     $.ajax({
	    	 url:getRootPath()+"/PublicAction.sendMobileValidateCode.do?FAPView=JSON", //目标地址
	    	 async:true,
	    	 data : parms,
	    	 success: function (data){
	    		var data=$.parseJSON(data);
	    		 //console.log(data);
	    		 func(data);
	    	 },
	    	 error: function (XMLHttpRequest, textStatus, errorThrown){ 
	    		 //location = "index.html";
	    	 }
	     });
    };
    var curCount=0;//当前剩余秒数
	//手机验证码倒计时
	function sign(){
		var InterValObj; //timer变量，控制时间
		var count = 60; //间隔函数，1秒执行
		function sendMessage(){
			curCount=parseInt(count);
			//设置button效果，开始计时
		     $(".sign_time").text(curCount);
		     InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
		};
		//timer处理函数
		function SetRemainTime() {
	        if(curCount == 0){            
	        	$(".sign_next_again").removeAttr("disabled");
	            window.clearInterval(InterValObj);//停止计时器
	            $(".sign_next_time").css("display","none");
	            $(".sign_next_again").css("display","block").text("重新获取");
	        }
	        else {
	            curCount--;
	            $(".sign_time").text(curCount);
	        };
	    };
	    sendMessage();
	}
	//点击获取验证码
	$(".sign_next_again").on("click",function(){
		$(this).attr('disabled',"true");
		$(this).css("display","none");
		$(".sign_next_time").css("display","block");
		auto(function(data){
			sign_phone=data;
		});
		sign();
	});
	//点击完成注册
	$("#OK").on("click",function(){
		$(".sign_next_again").removeAttr("disabled");
		curCount=0;
		var psw_pay=$("#sign_psw2").val();
		var mobileValidateCode=$("#sign_tel2").val();
		if(isPsw_two()==true){
			var parms = {};
			parms.registerType="2";
			parms.userId=tel;
			parms.password=hex_md5(psw);//密码加密
			/*parms.password=psw;*/
			parms.payPwd=encryptByDES(psw_pay);
			parms.flag="0";
			parms.mobileValidateCode=encryptByDES(mobileValidateCode);
	     $.ajax({
	    	 url:getRootPath()+"/SystemAction.userRegister.do?FAPView=JSON", //目标地址
	    	 async:true,
	    	 data : parms,
	    	 success: function (data){
	    		 var data=$.parseJSON(data);
	    		 //console.log(data);
	    		 if(psw==psw_pay){
	    			 $(".sign_mask").css("display","block").text("登录密码与支付密码相同");
	    			 setTimeout(function(){
    					$(".sign_mask").css("display","none");
    				},2000);
	    		 }else if(data.FAPStatus=="0"){
	    			 if(data.success==true){
	    				 $(".sign_mask").css("display","block").text("注册成功");
			    		 var params = {};
			    		 params.loginType="2";
			    		 params.userId=tel;
			    		 params.password=hex_md5(psw);//密码加密
			    		 params.passwordType="1";
			    		 $.ajax({
			    			 url : getRootPath()+"/PublicPayAction.sdkLoginFirst.do?FAPView=JSON",
			 				data : params,
			 				success : function(data) {
			 					var data=$.parseJSON(data);
			 					//console.log(data);
			 					if(data.FAPStatus=="0" ){
			 						if(data.success==true){
			 							var customerNo=data.data.customerNo;
					 					var sessionId=data.data.sessionId;
					 					var str="customerNo="+customerNo+"&sessionId="+sessionId/*+"&psw_pay="+psw_pay*/+"&login_money="+login_money+"&tel="+tel+"&orderNo="+orderNo+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
					 					var publicStr=publicKey(str);
					 					window.location.href="../views/payment.html?"+publicStr;
			 						}else{
			 							 $(".sign_mask").css("display","block").text(data.errors.msg);
			 			    			 setTimeout(function(){
			 								$(".sign_mask").css("display","none");
			 							},2000);
			 						};	
			 					}else{
			 						$(".sign_mask").css("display","block").text(data.FAPErrorMessage);
			 		    			 setTimeout(function(){
			 	    					$(".sign_mask").css("display","none");
			 	    				},2000);
			 					};
			 					
			 				},
			 				error:function(a,b,c){
			 					console.log("失败");
			 				}
			    		 });
	    			 }else{
	    				 $(".sign_mask").css("display","block").text(data.errors.msg);
		    			 setTimeout(function(){
							$(".sign_mask").css("display","none");
						},2000);
	    			 }
	    		 }else{
	    			 $(".sign_mask").css("display","block").text(data.FAPErrorMessage);
	    			 setTimeout(function(){
    					$(".sign_mask").css("display","none");
    				},2000);
	    		 };
	    	 },
	    	 error: function (XMLHttpRequest, textStatus, errorThrown){ 
	    		 //location = "index.html";
	    	 }
	     });	
		}else{
			$(".sign_mask").css("display","block").text("密码格式错误");
			setTimeout(function(){
				$(".sign_mask").css("display","none");
			},2000);
		};
	});
	//点击返回注册第一页
	$("#sign_back").on("click",function(){
		var str="tel="+tel+"&psw="+psw+"&login_money="+login_money+"&orderNo="+orderNo+"&mallId="+mallId+"&notifyUrl="+notifyUrl;
		var publicStr=publicKey(str);
		location.href=encodeURI("../views/sign.html?"+publicStr);
	});
})(jQuery);
