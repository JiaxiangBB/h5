
//登录注册输入框获取焦点 失去焦点 错误信息提示
var error={};
error.telephone=function(mobile,tab_password,tab_img,tab_login){
	var message_phone="";
	var rules_phone = /^1[34578][0-9]{9}$/;
    var isTel=rules_phone.test(mobile); 
    if(mobile==""){
    	tab_login.text("手机号不可为空");
		tab_password.attr("disabled",true); 
		tab_img.attr("disabled",true);
		message_phone=false;
	}else{
		if(isTel==true){
			tab_password.attr("disabled",false); 
			message_phone=true;
		}else{
			tab_login.text("手机号格式错误");
			tab_password.attr("disabled",true); 
			tab_img.attr("disabled",true);
			message_phone=false;
		}
	}
    return message_phone;
};
error.password=function(password,tab_img,tab_login){
	var message_psw="";
	var rules_login = /^[^\s]{6,16}$/;
    var isPsw= rules_login.test(password);
    if(password==""){
    	tab_login.text("密码不可为空");
		tab_img.attr("disabled",true);
		message_psw=false;
	}else{
		if(isPsw==true){
			tab_img.attr("disabled",false);
			message_psw=true;
		}else{
			tab_login.text("密码号格式错误");
			tab_img.attr("disabled",true);
			message_psw=false;
		}
	}
    return message_psw;
};
error.payPassword=function(pay_password,tab_img,tab_login){
	var message_pay="";
	var rules_pay = /^\d{6}$/;
    var isPayPsw= rules_pay.test(pay_password);
    if(pay_password==""){
    	tab_login.text("支付密码不可为空");
		tab_img.attr("disabled",true);
		message_pay=false;
	}else{
		if(isPayPsw==true){
			tab_img.attr("disabled",false);
			message_pay=true;
		}else{
			tab_login.text("支付密码格式错误");
			tab_img.attr("disabled",true);
			message_pay=false;
		}
	}
    return message_pay;
};
error.testImg=function(password_img,tab_img,tab_login){
	var message_img="";
	if(password_img==""){
		tab_login.text("图片验证不可为空");
		message_img=false;
	}else{
		message_img=true;
	}
	return message_img;
};
error.shortImg=function(password_short,tab_img,tab_login){
	var message_short="";
	if(password_short==""){
		tab_img.attr("disabled",false);
		tab_login.text("短信验证不可为空");
		message_short=false;
	}else{
		tab_img.attr("disabled",false);
		message_short=true;
	}
	return message_short;
};

/**
 * 截取URL获取参数
 */	
function getUrlParam(){
	var url = location.href;
	var paramSuit = url.substring(url.indexOf('?') + 1).split("&");
	var paramObj = {};
	for (var i = 0; i < paramSuit.length; i++) {
		var param = paramSuit[i].split('=');
		if (param.length == 2) {
			var key = decodeURIComponent(param[0]);
			var val = decodeURIComponent(param[1]);
			if (paramObj.hasOwnProperty(key)) {
				paramObj[key] = jQuery.makeArray(paramObj[key]);
				paramObj[key].push(val);
			} else {
				paramObj[key] = val;
			}
		}
	}
	return paramObj;
}
//DES加密
function encryptByDES(message) {
    var keyHex = CryptoJS.enc.Utf8.parse("@w@$@$%666ALWYTIAgzmN+dc9/VSz6rHG6WG3Jgn3TpmZSY");
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

//对参数进行rsa加密封装
function publicKeyRSA(data) {
	var encrypt = new JSEncrypt();           
    encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr7ureWf8AF5tO6vB9b9veI9BXA+g7/t3+HGHKE54/EXtSY440x1bVrfbx8OMytj+2AtX1FCmImVRP7frkEs7cOok7ivdwYXE/nPRCBMKIhu8ylMFt/6Wj86Y1pgVr82rLjxSIeLhLoaJvOmivb6Yp9SmgwjNzSbHURjGk5u5K7wIDAQAB"); 
	
    var encrypted = encrypt.encrypt(data); 
	// console.log(data);
	//console.log(encrypted);
	return encrypted;
}
/*function privateKey(data){
	var decrypt = new JSEncrypt();           
	   decrypt.setPrivateKey("MIICXQIBAAKBgQD5ShvsLQgauM+HB0ChyXBfLrp28M7WOiASZp4DXFYDaEd13aJ91JXs4EkVqR1ZZPgNcS3Op4yzuFYtgH6yGgwScspDs4/P/I18aF+lj0j+NgoK8NgLfGtgBIrSV4fkQPfmRFmv4c4uBIXK7kxe5IZ1BEuWkDwzMAJOi4k5qQVzbwIDAQABAoGBAMzIACAG7f1li7TUVFeS7miCLlK+hmqc3PPAsFT6aP3rj6hXJMBQ/cfUhrTwc1eYBdyk+IgmQwLvjntabrlHhFmUPuDr2NNFIC34IKuacRaAmrGwF5UUgD7fFZ94W+AxgvilerFaVenqvM3rz+Ds1Fuz6abjffVEmpX8WCCLu59hAkEA/P0UBx2ahoy7kjhJx1uM/PW8oZ3nepbmVUvypsSFIISVdI9KeDlD+/XTPdFge5cvEjbMlWdnQo11E5Jgo25HZQJBAPxBwjwBnD1coLCmvdsneFQj33tBCiN4qk4CYC9jJKGkqgkpB6KlujF2iJ/ZB12EIH4WG2vPcroogcnDKggjdEMCQEDUMX+pTGHSSnaryew2P6jK5+2aYyj85kVRUvr9PQgaMZpO5cxtEEjOs7URpGHHWh6WwFJAzys0yJ2dUvpOVikCQGjsBRkmZlEThPbU8+UCvsbogNzoSYpFdzipPk6XgzYEooDa4wUgv5gxQFSUVb7s5QLsuQ0XpRWPIaTFG2d1L7cCQQC1RG4RIBh4YDjUZFjraiT2JFVqf4PVqPDxV3OsgJdsRisP6UeFgcNJlrKneJLcCfloJhHQM6Sf4ubhZ42sehY/");           
	   var uncrypted = decrypt.decrypt(data);           
	   return  uncrypted;   
	         
}*/
//对所有 iPhone 和 Android 4+ 的手机屏幕进行适配：
var match,
scale,
TARGET_WIDTH = 320;

if (match = navigator.userAgent.match(/Android (\d+\.\d+)/)) {
	if (parseFloat(match[1]) < 4.4) {
	    if (TARGET_WIDTH == 320) TARGET_WIDTH++;
	    var scale = window.screen.width / TARGET_WIDTH;
	    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=' + TARGET_WIDTH + ', initial-scale = ' + scale + ', target-densitydpi=device-dpi');
	}
} else {
	document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=' + TARGET_WIDTH);
}
//对参数进行加密封装
function publicKey(data) {    
   var b = new Base();  
   var str = b.encode(data); 
   return str;
}
function privateKey(data){
	var b = new Base();  
	var str = b.decode(data); 
	return str;
}

//点击获取验证码倒计时
var curCount;//当前剩余秒数
var numBer=1;//判断是否显示重新获取
function sign(){
	$(".applySend").removeAttr("disabled");//删除点击禁止事件
	$(".SendPhoneMessage").removeAttr("disabled");//删除点击禁止事件
	$(".SendLifePhone").css("display","none");
	$(".sign_next_again").css("display","none");
	$(".sign_next_time").css("display","inline-block").hover(function(){
	    $(".sign_next_time").css("color","#333");
	});
	var InterValObj; //timer变量，控制时间
	var count = 60; //间隔函数，1秒执行
	function sendMessage(){
		curCount=parseInt(count);
		numBer=1;
		//设置button效果，开始计时
	     $(".sign_time").text(curCount);
	     InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
	     //手机验证码         向后台发送处理数据
	};
	//timer处理函数
	function SetRemainTime() {
		//console.log(curCount)
        if(curCount == 0){                
            window.clearInterval(InterValObj);//停止计时器
            if(numBer==0){
            	
            }else{
            	$(".sign_next_time").css("display","none");
                $(".SendLifePhone").css("display","inline-block");
                $(".SendLifePhone").text("重新获取");
                $(".sign_next_again").css("display","inline-block");
                $(".sign_next_again").text("重新获取");
            }
            
        }
        else {
            curCount--;
            $(".sign_time").text(curCount);
        }
    };
    sendMessage();
}
//设置金额
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
//封装判断银行卡样式
function bankCard(cardNo,img){
	if(cardNo.indexOf("工商")>=0){
		img=imgSRC+"card/zggsyh@2x.png";
	}else if(cardNo.indexOf("建设")>=0){
		img=imgSRC+"card/zgjsyh@2x.png";
	}else if(cardNo.indexOf("中国")>=0){
		img=imgSRC+"card/zgyh@2x.png";
	}else if(cardNo.indexOf("农业")>=0){
		img=imgSRC+"card/nongye_06.png";
	}else if(cardNo.indexOf("兴业")>=0){
		img=imgSRC+"card/xyyh@2x.png";
	}else if(cardNo.indexOf("光大")>=0){
		img=imgSRC+"card/zggdyh@2x.png";
	}else if(cardNo.indexOf("民生")>=0){
		img=imgSRC+"card/zgmsyh@2x.png";
	}else if(cardNo.indexOf("邮储")>=0||cardNo.indexOf("邮政储蓄")>=0){
		img=imgSRC+"card/zgyzcxyh@2x.png";
	}else if(cardNo.indexOf("中信")>=0){
		img=imgSRC+"card/zxyh@2x.png";
	}else if(cardNo.indexOf("平安")>=0){
		img=imgSRC+"card/payh@2x.png";
	}else if(cardNo.indexOf("交通")>=0){
		img=imgSRC+"card/jtyh@2x.png";
	}else if(cardNo.indexOf("华夏")>=0){
		img=imgSRC+"card/nbyh@2x.png";
	}else if(cardNo.indexOf("浦发")>=0){
		img=imgSRC+"card/pfyh@2x.png";
	}else if(cardNo.indexOf("广发")>=0){
		img=imgSRC+"card/gfyh@2x.png";
	}else if(cardNo.indexOf("广西农村信用社")>=0 || cardNo.indexOf("辽宁省农村信用社")>=0 || cardNo.indexOf("河南省农村信用社")>=0 || cardNo.indexOf("湖南省农村信用社")>=0 || cardNo.indexOf("四川省农村信用社")>=0 || cardNo.indexOf("湖北省农村信用社")>=0 || cardNo.indexOf("河北省农村信用社")>=0 || cardNo.indexOf("甘肃省农村信用社")>=0 || cardNo.indexOf("陕西省农村信用社")>=0 || cardNo.indexOf("内蒙古农村信用社")>=0 || cardNo.indexOf("吉林省农村信用社")>=0 || cardNo.indexOf("山西省农村信用社")>=0){
		img=imgSRC+"card/xin@2x.png";
	}else if(cardNo.indexOf("北京农商")>=0){
		img=imgSRC+"card/bjrcb@2x.png";
	}else if(cardNo.indexOf("北京")>=0){
		img=imgSRC+"card/bob@2x.png";
	}else if(cardNo.indexOf("成都")>=0){
		img=imgSRC+"card/bocd@2x.png";
	}else if(cardNo.indexOf("洛阳")>=0){
		img=imgSRC+"card/boly@2x.png";
	}else if(cardNo.indexOf("江西")>=0){
		img=imgSRC+"card/bonc@2x.png";
	}else if(cardNo.indexOf("上海")>=0){
		img=imgSRC+"card/bos@2x.png";
	}else if(cardNo.indexOf("厦门")>=0){
		img=imgSRC+"card/boxm@2x.png";
	}else if(cardNo.indexOf("长江")>=0){
		img=imgSRC+"card/cjccb@2x.png";
	}else if(cardNo.indexOf("长安")>=0){
		img=imgSRC+"card/chab@2x.png";
	}else if(cardNo.indexOf("招商")>=0){
		img=imgSRC+"card/cmb@2x.png";
	}else if(cardNo.indexOf("重庆农商")>=0){
		img=imgSRC+"card/cqrcb@2x.png";
	}else if(cardNo.indexOf("东营莱商村镇")>=0){
		img=imgSRC+"card/dylscz@2x.png";
	}else if(cardNo.indexOf("德州")>=0){
		img=imgSRC+"card/dzb@2x.png";
	}else if(cardNo.indexOf("广东南粤")>=0){
		img=imgSRC+"card/gdnyb@2x.png";
	}else if(cardNo.indexOf("广州农商")>=0){
		img=imgSRC+"card/grcb@2x.png";
	}else if(cardNo.indexOf("广州")>=0){
		img=imgSRC+"card/gzcb@2x.png";
	}else if(cardNo.indexOf("杭州")>=0){
		img=imgSRC+"card/hzb@2x.png";
	}else if(cardNo.indexOf("九江")>=0){
		img=imgSRC+"card/jjccb@2x.png";
	}else if(cardNo.indexOf("江苏")>=0){
		img=imgSRC+"card/jsb@2x.png";
	}else if(cardNo.indexOf("晋中")>=0){
		img=imgSRC+"card/jzcb@2x.png";
	}else if(cardNo.indexOf("临商")>=0){
		img=imgSRC+"card/lsb@2x.png";
	}else if(cardNo.indexOf("莱商")>=0){
		img=imgSRC+"card/lwb@2x.png";
	}else if(cardNo.indexOf("宁波")>=0){
		img=imgSRC+"card/nbcb@2x.png";
	}else if(cardNo.indexOf("南京")>=0){
		img=imgSRC+"card/njcb@2x.png";
	}else if(cardNo.indexOf("鄂尔多斯")>=0){
		img=imgSRC+"card/ordos@2x.png";
	}else if(cardNo.indexOf("齐商")>=0){
		img=imgSRC+"card/qsb@2x.png";
	}else if(cardNo.indexOf("日照")>=0){
		img=imgSRC+"card/rzb@2x.png";
	}else if(cardNo.indexOf("上海农商")>=0){
		img=imgSRC+"card/srcb@2x.png";
	}else if(cardNo.indexOf("泰安市商业")>=0){
		img=imgSRC+"card/tab@2x.png";
	}else if(cardNo.indexOf("潍坊")>=0){
		img=imgSRC+"card/wfccb@2x.png";
	}else if(cardNo.indexOf("温州")>=0){
		img=imgSRC+"card/wzcb@2x.png";
	}else if(cardNo.indexOf("龙江")>=0){
		img=imgSRC+"card/bolj@2x.png";
	}else if(cardNo.indexOf("徽商")>=0){
		img=imgSRC+"card/hsb@2x.png";
	}else if(cardNo.indexOf("汉口")>=0){
		img=imgSRC+"card/hkb@2x.png";
	}else if(cardNo.indexOf("天津滨海农村商业")>=0){
		img=imgSRC+"card/tjrcb@2x.png";
	}else if(cardNo.indexOf("包商")>=0){
		img=imgSRC+"card/bsb@2x.png";
	}else if(cardNo.indexOf("东莞农村商业")>=0){
		img=imgSRC+"card/drcb@2x.png";
	}else if(cardNo.indexOf("锦州")>=0){
		img=imgSRC+"card/jzb@2x.png";
	}else if(cardNo.indexOf("武汉农村商业")>=0){
		img=imgSRC+"card/whrcb@2x.png";
	}else if(cardNo.indexOf("东营")>=0){
		img=imgSRC+"card/dyccb@2x.png";
	}else if(cardNo.indexOf("威海市商业")>=0){
		img=imgSRC+"card/whccb@2x.png";
	}else if(cardNo.indexOf("攀枝花市商业")>=0){
		img=imgSRC+"card/pahccb@2x.png";
	}else if(cardNo.indexOf("恒丰")>=0){////////////////////////////////////////////////////////////////////////
		img=imgSRC+"card/pahccb@2x.png";
	}else if(cardNo.indexOf("江苏农村商业")>=0){
		img=imgSRC+"card/jsnx@2x.png";
	}else if(cardNo.indexOf("济宁")>=0){
		img=imgSRC+"card/bojn@2x.png";
	}else if(cardNo.indexOf("枣庄")>=0){
		img=imgSRC+"card/bozz@2x.png";
	}else if(cardNo.indexOf("烟台")>=0){
		img=imgSRC+"card/ytcb@2x.png";
	}else if(cardNo.indexOf("保定")>=0){
		img=imgSRC+"card/bobd@2x.png";
	}else if(cardNo.indexOf("渤海")>=0){
		img=imgSRC+"card/cbhb@2x.png";
	}else if(cardNo.indexOf("贵阳")>=0){
		img=imgSRC+"card/bogy@2x.png";
	}else if(cardNo.indexOf("兰州")>=0){
		img=imgSRC+"card/lzcb@2x.png";
	}else if(cardNo.indexOf("营口")>=0){
		img=imgSRC+"card/boyk@2x.png";
	}else if(cardNo.indexOf("浙江泰隆")>=0){
		img=imgSRC+"card/zjtlcb@2x.png";
	}else if(cardNo.indexOf("桂林")>=0){
		img=imgSRC+"card/bogl@2x.png";
	}else if(cardNo.indexOf("新韩")>=0){
		img=imgSRC+"card/shbank@2x.png";
	}else if(cardNo.indexOf("盘锦")>=0){
		img=imgSRC+"card/boyk@2x.png";
	}else if(cardNo.indexOf("张家口")>=0){
		img=imgSRC+"card/zjkccb@2x.png";
	}else if(cardNo.indexOf("西安")>=0){
		img=imgSRC+"card/boxia@2x.png";
	}else if(cardNo.indexOf("天津农商")>=0){
		img=imgSRC+"card/tjrcb@2x.png";
	}else if(cardNo.indexOf("青岛")>=0){
		img=imgSRC+"card/qdccb@2x.png";
	}
	return img;
}

//封装判断银行卡背景样式
function bankCardBg(cardNo,img){
	if(cardNo.indexOf("工商")>=0){
		img=imgSRC+"cardBg/icbc_1@2x.png";
	}else if(cardNo.indexOf("建设")>=0){
		img=imgSRC+"cardBg/ccb_1@2x.png";
	}else if(cardNo.indexOf("中国")>=0){
		img=imgSRC+"cardBg/boc_1@2x.png";
	}else if(cardNo.indexOf("农业")>=0){
		img=imgSRC+"cardBg/abc_1@2x.png";
	}else if(cardNo.indexOf("兴业")>=0){
		img=imgSRC+"cardBg/cib_1@2x.png";
	}else if(cardNo.indexOf("光大")>=0){
		img=imgSRC+"cardBg/ceb_1@2x.png";
	}else if(cardNo.indexOf("民生")>=0){
		img=imgSRC+"cardBg/cmbc_1@2x.png";
	}else if(cardNo.indexOf("邮储")>=0||cardNo.indexOf("邮政储蓄")>=0){
		img=imgSRC+"cardBg/psbc_1@2x.png";
	}else if(cardNo.indexOf("中信")>=0){
		img=imgSRC+"cardBg/citic_1@2x.png";
	}else if(cardNo.indexOf("平安")>=0){
		img=imgSRC+"cardBg/pab_1@2x.png";
	}else if(cardNo.indexOf("交通")>=0){
		img=imgSRC+"cardBg/jtyh_1@2x.png";
	}else if(cardNo.indexOf("华夏")>=0){
		img=imgSRC+"cardBg/hxb_1@2x.png";
	}else if(cardNo.indexOf("浦发")>=0){
		img=imgSRC+"cardBg/spdb_1@2x.png";
	}else if(cardNo.indexOf("广发")>=0){
		img=imgSRC+"cardBg/cgb_1@2x.png";
	}else if(cardNo.indexOf("广西农村信用社")>=0 || cardNo.indexOf("辽宁省农村信用社")>=0 || cardNo.indexOf("河南省农村信用社")>=0 || cardNo.indexOf("湖南省农村信用社")>=0 || cardNo.indexOf("四川省农村信用社")>=0 || cardNo.indexOf("湖北省农村信用社")>=0 || cardNo.indexOf("河北省农村信用社")>=0 || cardNo.indexOf("甘肃省农村信用社")>=0 || cardNo.indexOf("陕西省农村信用社")>=0 || cardNo.indexOf("内蒙古农村信用社")>=0 || cardNo.indexOf("吉林省农村信用社")>=0 || cardNo.indexOf("山西省农村信用社")>=0){
		img=imgSRC+"cardBg/xin_1@2x.png";
	}else if(cardNo.indexOf("北京农商")>=0){
		img=imgSRC+"cardBg/bjrcb_1@2x.png";
	}else if(cardNo.indexOf("北京")>=0){
		img=imgSRC+"cardBg/bob_1@2x.png";
	}else if(cardNo.indexOf("成都")>=0){
		img=imgSRC+"cardBg/bocd_1@2x.png";
	}else if(cardNo.indexOf("洛阳")>=0){
		img=imgSRC+"cardBg/boly_1@2x.png";
	}else if(cardNo.indexOf("江西")>=0){
		img=imgSRC+"cardBg/bonc_1@2x.png";
	}else if(cardNo.indexOf("上海")>=0){
		img=imgSRC+"cardBg/bos_1@2x.png";
	}else if(cardNo.indexOf("厦门")>=0){
		img=imgSRC+"cardBg/boxm_1@2x.png";
	}else if(cardNo.indexOf("长江")>=0){
		img=imgSRC+"cardBg/cjccb_1@2x.png";
	}else if(cardNo.indexOf("长安")>=0){
		img=imgSRC+"cardBg/chab_1@2x.png";
	}else if(cardNo.indexOf("招商")>=0){
		img=imgSRC+"cardBg/cmb_1@2x.png";
	}else if(cardNo.indexOf("重庆农商")>=0){
		img=imgSRC+"cardBg/cqrcb_1@2x.png";
	}else if(cardNo.indexOf("东营莱商村镇")>=0){
		img=imgSRC+"cardBg/dylscz_1@2x.png";
	}else if(cardNo.indexOf("德州")>=0){
		img=imgSRC+"cardBg/dzb_1@2x.png";
	}else if(cardNo.indexOf("广东南粤")>=0){
		img=imgSRC+"cardBg/gdnyb_1@2x.png";
	}else if(cardNo.indexOf("广州农商")>=0){
		img=imgSRC+"cardBg/grcb_1@2x.png";
	}else if(cardNo.indexOf("广州")>=0){
		img=imgSRC+"cardBg/gzcb_1@2x.png";
	}else if(cardNo.indexOf("杭州")>=0){
		img=imgSRC+"cardBg/hzb_1@2x.png";
	}else if(cardNo.indexOf("九江")>=0){
		img=imgSRC+"cardBg/jjccb_1@2x.png";
	}else if(cardNo.indexOf("江苏")>=0){
		img=imgSRC+"cardBg/jsb_1@2x.png";
	}else if(cardNo.indexOf("晋中")>=0){
		img=imgSRC+"cardBg/jzcb_1@2x.png";
	}else if(cardNo.indexOf("临商")>=0){
		img=imgSRC+"cardBg/lsb_1@2x.png";
	}else if(cardNo.indexOf("莱商")>=0){
		img=imgSRC+"cardBg/lwb_1@2x.png";
	}else if(cardNo.indexOf("宁波")>=0){
		img=imgSRC+"cardBg/nbcb_1@2x.png";
	}else if(cardNo.indexOf("南京")>=0){
		img=imgSRC+"cardBg/njcb_1@2x.png";
	}else if(cardNo.indexOf("鄂尔多斯")>=0){
		img=imgSRC+"cardBg/ordos_1@2x.png";
	}else if(cardNo.indexOf("齐商")>=0){
		img=imgSRC+"cardBg/qsb_1@2x.png";
	}else if(cardNo.indexOf("日照")>=0){
		img=imgSRC+"cardBg/rzb_1@2x.png";
	}else if(cardNo.indexOf("上海农商")>=0){
		img=imgSRC+"cardBg/srcb_1@2x.png";
	}else if(cardNo.indexOf("泰安市商业")>=0){
		img=imgSRC+"cardBg/tab_1@2x.png";
	}else if(cardNo.indexOf("潍坊")>=0){
		img=imgSRC+"cardBg/wfccb_1@2x.png";
	}else if(cardNo.indexOf("温州")>=0){
		img=imgSRC+"cardBg/wzcb_1@2x.png";
	}else if(cardNo.indexOf("龙江")>=0){
		img=imgSRC+"cardBg/bolj_1@2x.png";
	}else if(cardNo.indexOf("徽商")>=0){
		img=imgSRC+"cardBg/hsb_1@2x.png";
	}else if(cardNo.indexOf("汉口")>=0){
		img=imgSRC+"cardBg/hkb_1@2x.png";
	}else if(cardNo.indexOf("天津滨海农村商业")>=0){
		img=imgSRC+"cardBg/tjrcb_1@2x.png";
	}else if(cardNo.indexOf("包商")>=0){
		img=imgSRC+"cardBg/bsb_1@2x.png";
	}else if(cardNo.indexOf("东莞农村商业")>=0){
		img=imgSRC+"cardBg/drcb_1@2x.png";
	}else if(cardNo.indexOf("锦州")>=0){
		img=imgSRC+"cardBg/jzb_1@2x.png";
	}else if(cardNo.indexOf("武汉农村商业")>=0){
		img=imgSRC+"cardBg/whrcb_1@2x.png";
	}else if(cardNo.indexOf("东营")>=0){
		img=imgSRC+"cardBg/dyccb_1@2x.png";
	}else if(cardNo.indexOf("威海市商业")>=0){
		img=imgSRC+"cardBg/whccb_1@2x.png";
	}else if(cardNo.indexOf("攀枝花市商业")>=0){
		img=imgSRC+"cardBg/pahccb_1@2x.png";
	}else if(cardNo.indexOf("恒丰")>=0){////////////////////////////////////////////////////////////////////////
		img=imgSRC+"cardBg/pahccb@2x.png";
	}else if(cardNo.indexOf("江苏农村商业")>=0){
		img=imgSRC+"cardBg/jsnx_1@2x.png";
	}else if(cardNo.indexOf("济宁")>=0){
		img=imgSRC+"cardBg/bojn_1@2x.png";
	}else if(cardNo.indexOf("枣庄")>=0){
		img=imgSRC+"cardBg/bozz_1@2x.png";
	}else if(cardNo.indexOf("烟台")>=0){
		img=imgSRC+"cardBg/ytcb_1@2x.png";
	}else if(cardNo.indexOf("保定")>=0){
		img=imgSRC+"cardBg/bobd_1@2x.png";
	}else if(cardNo.indexOf("渤海")>=0){
		img=imgSRC+"cardBg/cbhb_1@2x.png";
	}else if(cardNo.indexOf("贵阳")>=0){
		img=imgSRC+"cardBg/bogy_1@2x.png";
	}else if(cardNo.indexOf("兰州")>=0){
		img=imgSRC+"cardBg/lzcb_1@2x.png";
	}else if(cardNo.indexOf("营口")>=0){
		img=imgSRC+"cardBg/boyk_1@2x.png";
	}else if(cardNo.indexOf("浙江泰隆")>=0){
		img=imgSRC+"cardBg/zjtlcb_1@2x.png";
	}else if(cardNo.indexOf("桂林")>=0){
		img=imgSRC+"cardBg/bogl_1@2x.png";
	}else if(cardNo.indexOf("新韩")>=0){
		img=imgSRC+"cardBg/shbank_1@2x.png";
	}else if(cardNo.indexOf("盘锦")>=0){
		img=imgSRC+"cardBg/boyk_1@2x.png";
	}else if(cardNo.indexOf("张家口")>=0){
		img=imgSRC+"cardBg/zjkccb_1@2x.png";
	}else if(cardNo.indexOf("西安")>=0){
		img=imgSRC+"cardBg/boxia_1@2x.png";
	}else if(cardNo.indexOf("天津农商")>=0){
		img=imgSRC+"cardBg/tjrcb_1@2x.png";
	}else if(cardNo.indexOf("青岛")>=0){
		img=imgSRC+"cardBg/qdccb_1@2x.png";
	}
	return img;
}

//初始化支付方式银行卡信息
function pub(parms,element){
	$.ajax({
		url :getRootPath()+"/PrepaidCardAction.cardQuery.do?FAPView=JSON",
		type: 'post',
		data : parms,
		success : function(data) {
			var data=$.parseJSON(data);
			//console.log("------支付方式-------");
			//console.log(data);
			if(data.FAPStatus==0){
				if(data.success==true){
					var bankcard_list = data.data.bankcard;
					var cdcard_list = data.data.cdcard;
					for(var i=0;i<bankcard_list.length;i++){
						var CARDNAME = bankcard_list[i].CARDNAME //银行卡类型
						var bankcardNo = bankcard_list[i].ACCOUNTNO//卡号
						var BANKNAME = bankcard_list[i].BANKNAME;
						var img="";
						img=bankCard(BANKNAME,img);
						var interceptBank = bankcardNo.substring(6,bankcardNo.length-4);//截取卡号中间9位
						var ACCOUNTNO = bankcardNo.substr(0,6)+interceptBank.replace(interceptBank,"*********")+bankcardNo.substr(bankcardNo.length-4,4);
						$(element).prepend('<h3>'
								+'<input type="radio" name="payCard" value="'+bankcardNo+'"></input>'
								+'<img src="'+img+'">'
								+'<span>'+ACCOUNTNO+'</span>'
								+'<b ng-click="add_open()" style="cursor:pointer;display:none">添加开户行</b>'
						+'</h3>');
					};
					$(element+">:first").find("input").attr("checked","checked");//默认第一个input选中
					$(element+" h3").on("click",function(){
						$(this).find("input").attr("checked","checked").siblings().find("input").attr("checked","");
					})
				}else{
					$("#mark_two").css("display","block").find(".text").text(data.errors.msg);
				}
			}else if(data.FAPStatus==2){
				$("#mark_two").css("display","block").find(".text").text("请重新登录");
		    	$(".change").live("click",function(){
		    		$("#mark_two").css("display","none");
		    		window.location.href=getRootPath()+"/walletpc/src/index.html";
		    	})
			}else{
				$("#mark_two").css("display","block").find(".text").text(data.FAPErrorMessage);
			}	
		},
		error:function(a,b,c){
			alert("错误");
		}					
	});
}
//设置背景图片   imgSRC+"card/zgjsyh@2x.png";
//document.getElementById("BackgroundArea").style.backgroundImage="url("+currentImage+")";
