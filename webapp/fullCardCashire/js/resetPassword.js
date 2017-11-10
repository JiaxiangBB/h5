//解析参数
var url = window.location.search;
var str = url.substr(1);
var privateStr="?"+privateKey(str);
function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(privateStr)||[,""])[1].replace(/\+/g, '%20'))||null;
};
var phone_number=getURLParameter("phone_number");
var verification_code=getURLParameter("verification_code");
var Image_code=getURLParameter("Image_code");
//检测密码
function isPsw() {
	var psw = $('#new_password').val();
    var rules = /^[^\s]{6,16}$/;
    return rules.test(psw);
};
//点击提交
$("#sub").on("click",function(){
	var new_password=$("#new_password").val();
	alert(1);
	if(isPsw()==true){
		var parms = {};
		parms.userName=phone_number;
		parms.findWay=0;
		parms.password=new_password;
		parms.confirmPassword=new_password;
		parms.smsCode=verification_code;
		parms.verifyCode=Image_code;
		$.ajax({
			url :getRootPath()+"/SecurityCenterAction.findLoginPwd.do?FAPView=JSON",
			data : parms,
			success : function(data) {
				console.log(data);
				var data=$.parseJSON(data);
				console.log(data);
				//location.href=encodeURI("../views/login.html");
			},
			error : function() {
				//location = "index.html";
			}
		});
	}else{
		$(".login_mask").css("display","block").text("密码格式错误");
		setTimeout(function(){
			$(".login_mask").css("display","none");
		},2000);
	}
});