function getRootPath(){   
    var pathName = window.location.pathname.substring(1);   
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));  
    var str=window.location.host;
    var rootPath;
    if(str.substr(str.length-1,1)=="m"){
    	rootPath = window.location.protocol + '//' + str;
    }else{
      rootPath = window.location.protocol + '//' + str + '/'+ 'service';
    }
    return  rootPath;
};

//DES加密
function encryptByDES(message) {
    var keyHex = CryptoJS.enc.Utf8.parse("@w@$@$%666ALWYTIAgzmN+dc9/VSz6rHG6WG3Jgn3TpmZSY");
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
//官网静态资源图片路径
var imgSRC="./";
//获取参数
var url = window.location.search;
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
};
//判断是不是分享页
var share=getURLParameter("share");
//活动页面显示邀请码
var invitationCode=getURLParameter("invitationCode");
$(".invitation").find("span").eq(0).text(invitationCode.substr(0,1));
$(".invitation").find("span").eq(1).text(invitationCode.substr(1,1));
$(".invitation").find("span").eq(2).text(invitationCode.substr(2,1));
$(".invitation").find("span").eq(3).text(invitationCode.substr(3,1));
if(share=="true"){
	$(".registerNow").show();
}else{
	$(".registerNow").hide();
}
//鼠标滚动显示立即注册
$(function(){
	//鼠标滚动获取元素距离顶部的距离
	var invitationCode=getURLParameter("invitationCode");
	//console.log(invitationCode)
	//var invitationCode="004";
	 $(".registerNow").on("click",function(){
	 	$(".invitationT").find("span").eq(0).text(invitationCode.substr(0,1));
		$(".invitationT").find("span").eq(1).text(invitationCode.substr(1,1));
		$(".invitationT").find("span").eq(2).text(invitationCode.substr(2,1));
		$(".invitationT").find("span").eq(3).text(invitationCode.substr(3,1));
		$(".registerNow").hide();
	 	$(".homePage").hide().siblings(".registrationPage").show();
		$('.box').animate({ scrollTop: 0 }, 500); //回到顶点
		$(".box").scroll(function (){
			var height=$(window).height();
			var st = $(this).scrollTop();
			if(parseInt(st) > parseInt(height)){
				$(".registerNow").show();
			}else{
				$(".registerNow").hide();
			}
		});
	});
	 //显示邀请码
	 $(".invitationCode p span").text(invitationCode);
});
//注册功能
$(function(){
	//console.log(getRootPath());
	var field=true;
	//输入验证码时验证
	$(".message").focus(function(){
		if(field){
			$(".register span").css("opacity","1").text("请点击获取验证码按钮");
		}else{
			$(".register span").css("opacity","0");
		}
	});
	//检测手机号
	$(".phone").blur(function(){
		var tel = $('.phone').val(),
	  		rules = /^1[34578][0-9]{9}$/;
		if(rules.test(tel)==false){
			$(".register span").css("opacity","1").text("您输入的手机号格式错误，请重新输入");
		}else{
			$(".register span").css("opacity","0");
		}
	});
	//检测密码
	$(".password").blur(function(){
		var pas = $('.password').val(),
	  		rules = /^[^\s]{6,16}$/;
		if(rules.test(pas)==false){
			$(".register span").css("opacity","1").text("您输入的密码格式错误，请重新输入");
		}else{
			$(".register span").css("opacity","0");
		}
	});
	//检测密码
	$(".payPassword").blur(function(){
		var payPas = $('.payPassword').val(),
	  		rules = /^\d{6}$/;
		if(rules.test(payPas)==false){
			$(".register span").css("opacity","1").text("您输入的密码格式错误，请重新输入");
		}else{
			$(".register span").css("opacity","0");
		}
	});
	function testing(){
		var parms = {};
		parms.registerType= 2 ;//注册ID类型
		parms.userId= $('.phone').val();//注册ID  邮箱或手机号码
		$.ajax({//校验手机号
			url :getRootPath()+"/SystemAction.validateRegisterId.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						auto(function(data){
					    	 sign_phone=data;
						});
					}else{
						$(".register span").css("opacity","1").text(data.errors.msg);
						$(".obtainMessage").removeAttr("disabled").css("background-color","#ff4635");;//删除点击禁止事件
					}
				}else{
					$(".register span").css("opacity","1").text(data.FAPErrorMessage);
					$(".obtainMessage").removeAttr("disabled").css("background-color","#ff4635");;//删除点击禁止事件
				}
			},
			error:function(a,b,c){
				$(".register span").css("opacity","1").text("请检查您的网络");
				$(".obtainMessage").removeAttr("disabled").css("background-color","#ff4635");;//删除点击禁止事件
			}					
		});
	};
	var sign_phone="";
	//发送短信验证码
	$(".obtainMessage").off("click").on("click",function(){
		field=false;
		$(".obtainMessage").attr({"disabled":"disabled"}).css("background-color","#ccc");
		testing();
	});
	
	//获取验证码
	function auto(func){
		var state;
		var parms = {};
		var mobile =  $(".phone").val();//手机号
		parms.mobileNo=encryptByDES(mobile);//登录方式
		parms.validateType=1;//用户注册1
	     $.ajax({
	    	 url:getRootPath()+"/PublicAction.sendMobileValidateCode.do?FAPView=JSON", //目标地址
	    	 async:true,
	    	 data : parms,
	    	 success: function (data){
	    		var data=$.parseJSON(data);
	    		$(".obtainMessage").removeAttr("disabled").css("background-color","#ff4635");;//删除点击禁止事件
	    		//console.log(data);
	    		if(data.FAPStatus==0){
					if(data.success==true){
						$(".register span").css("opacity","1").text("验证码已发送，请查收");
						 func(data);
						 state=true;
					}else{
						$(".register span").css("opacity","1").text(data.errors.msg);
						state=false;
					}
				}else{
					$(".register span").css("opacity","1").text(data.FAPErrorMessage);
					state=false;
				}
	    		if(state==true){
	    			sign();
	    		}
	    	 },
	    	 error: function (XMLHttpRequest, textStatus, errorThrown){ 
	    		$(".register span").css("opacity","1").text("请检查您的网络");
	    		$(".obtainMessage").removeAttr("disabled").css("background-color","#ff4635");;//删除点击禁止事件
	    	 }
	     });
	     return state;
	    
    };
    
    var curCount;//当前剩余秒数
	var numBer=1;//判断是否显示重新获取
	function sign(){
		$(".obtainMessage").css("display","none");
		$(".messageTime").css("display","block");
		var InterValObj; //timer变量，控制时间
		var count = 60; //间隔函数，1秒执行
		function sendMessage(){
			curCount=parseInt(count);
			numBer=1;
			//设置button效果，开始计时
		     $(".messageTime").val(curCount+" 秒后再获取");
		     InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
		     //手机验证码         向后台发送处理数据
		};
		//timer处理函数
		function SetRemainTime(){
			//console.log(curCount)
	        if(curCount == 0){                
	            window.clearInterval(InterValObj);//停止计时器
	            if(numBer==0){
	            	
	            }else{
	            	$(".messageTime").css("display","none");
	                $(".obtainMessage").css("display","block").val("重新获取");
	            }
	        }
	        else {
	            curCount--;
	            $(".messageTime").val(curCount+" 秒后再获取");
	        }
	    };
	    sendMessage();
	};
	//点击注册
	$(".sub").off("click").on("click",function(){
		$(".sub").attr({"disabled":"disabled"}).css("background-image","url("+imgSRC+"actionImg/zhuce2.png)");
		var tel = $('.phone').val(),
  		rules = /^1[34578][0-9]{9}$/;
		if(rules.test(tel)==false){
			$(".register span").css("opacity","1").text("您输入的手机号格式错误，请重新输入");
			$(".sub").removeAttr("disabled").css("background-image","url("+imgSRC+"actionImg/zhuce1.png)");//删除点击禁止事件
		}else{
			var pas = $('.password').val(),
	  		rules = /^[^\s]{6,16}$/;
			if(rules.test(pas)==false){
				$(".register span").css("opacity","1").text("您输入的登录密码格式错误，请重新输入");
				$(".sub").removeAttr("disabled").css("background-image","url("+imgSRC+"actionImg/zhuce1.png)");//删除点击禁止事件
			}else{
				var payPas = $('.payPassword').val(),
	  			rules = /^\d{6}$/;
				if(rules.test(payPas)==false){
					$(".register span").css("opacity","1").text("您输入的支付密码格式错误，请重新输入");
					$(".sub").removeAttr("disabled").css("background-image","url("+imgSRC+"actionImg/zhuce1.png)");//删除点击禁止事件
				}else{
					var message=$(".message").val();
					if(message==""){
						$(".register span").css("opacity","1").text("请输入短信验证码");
						$(".sub").removeAttr("disabled").css("background-image","url("+imgSRC+"actionImg/zhuce1.png)");//删除点击禁止事件
					}else{
						if(pas==payPas){
							$(".register span").css("opacity","1").text("登录密码与支付密码不可相同");
							$(".sub").removeAttr("disabled").css("background-image","url("+imgSRC+"actionImg/zhuce1.png)");//删除点击禁止事件
						}else{
							$(".register span").css("opacity","0");
							curCount=0;
							register(tel,pas,message);
						}
					}
				}
			}
		}
	});
	function register(tel,pas,message){
		var parms = {};
		parms.registerType = "2";//注册id类型
		parms.userId = $(".phone").val();//注册id
		parms.password = hex_md5($(".password").val());//登录密码
		parms.flag = "0";//身份信息登记标志
		parms.mobileValidateCode = encryptByDES($(".message").val());//短信验证码
		parms.contactor=invitationCode;//邀请码
		$.ajax({
			url :getRootPath()+"/SystemAction.userRegister.do?FAPView=JSON",
			type: 'post',
			data : parms,
			success : function(data) {
				var data=$.parseJSON(data);
				$(".sub").removeAttr("disabled").css("background-image","url("+imgSRC+"actionImg/zhuce1.png)");//删除点击禁止事件
				//console.log(data);
				if(data.FAPStatus==0){
					if(data.success==true){
						$(".success").show().siblings(".register").hide();
						$(".box").unbind('scroll');
					}else{
						$(".register span").css("opacity","1").text(data.errors.msg);
					}
				}else{
					$(".register span").css("opacity","1").text(data.FAPErrorMessage);
				}
			},
			error:function(a,b,c){
				$(".register span").css("opacity","1").text("请检查您的网络");
				$(".sub").removeAttr("disabled").css("background-image","url("+imgSRC+"actionImg/zhuce1.png)");//删除点击禁止事件
			}					
		});
	};
	//点击下载APP
	$(".download").on("click",function(){
		$(this).attr({"disabled":"disabled"}).css("background-image","url("+imgSRC+"actionImg/xiazai2.png)");
		//var	judge=getURLParameter("judge");
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		if(isiOS==true){
			window.location.href="https://itunes.apple.com/cn/app/%E5%85%A8%E6%97%B6%E9%92%B1%E5%8C%85/id1172126710?mt=8";
			$(this).removeAttr("disabled").css("background-image","url("+imgSRC+"actionImg/xiazai.png)");//删除点击禁止事件
		}else{
			window.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.ohepay.wallet";
			$(this).removeAttr("disabled").css("background-image","url("+imgSRC+"actionImg/xiazai.png)");//删除点击禁止事件
		}
	});
});