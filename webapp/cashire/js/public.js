
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
var imgSRCi="../../walletpc/src/img/";
//封装判断银行卡样式
function bankCard(cardNo,img){
	if(cardNo.indexOf("工商")>=0){
		img=imgSRCi+"card/zggsyh@2x.png";
	}else if(cardNo.indexOf("建设")>=0){
		img=imgSRCi+"card/zgjsyh@2x.png";
	}else if(cardNo.indexOf("中国")>=0){
		img=imgSRCi+"card/zgyh@2x.png";
	}else if(cardNo.indexOf("农业")>=0){
		img=imgSRCi+"card/nongye_06.png";
	}else if(cardNo.indexOf("兴业")>=0){
		img=imgSRCi+"card/xyyh@2x.png";
	}else if(cardNo.indexOf("光大")>=0){
		img=imgSRCi+"card/zggdyh@2x.png";
	}else if(cardNo.indexOf("民生")>=0){
		img=imgSRCi+"card/zgmsyh@2x.png";
	}else if(cardNo.indexOf("邮储")>=0||cardNo.indexOf("邮政储蓄")>=0){
		img=imgSRCi+"card/zgyzcxyh@2x.png";
	}else if(cardNo.indexOf("中信")>=0){
		img=imgSRCi+"card/zxyh@2x.png";
	}else if(cardNo.indexOf("平安")>=0){
		img=imgSRCi+"card/payh@2x.png";
	}else if(cardNo.indexOf("交通")>=0){
		img=imgSRCi+"card/jtyh@2x.png";
	}else if(cardNo.indexOf("华夏")>=0){
		img=imgSRCi+"card/nbyh@2x.png";
	}else if(cardNo.indexOf("浦发")>=0){
		img=imgSRCi+"card/pfyh@2x.png";
	}else if(cardNo.indexOf("广发")>=0){
		img=imgSRCi+"card/gfyh@2x.png";
	}else if(cardNo.indexOf("广西农村信用社")>=0 || cardNo.indexOf("辽宁省农村信用社")>=0 || cardNo.indexOf("河南省农村信用社")>=0 || cardNo.indexOf("湖南省农村信用社")>=0 || cardNo.indexOf("四川省农村信用社")>=0 || cardNo.indexOf("湖北省农村信用社")>=0 || cardNo.indexOf("河北省农村信用社")>=0 || cardNo.indexOf("甘肃省农村信用社")>=0 || cardNo.indexOf("陕西省农村信用社")>=0 || cardNo.indexOf("内蒙古农村信用社")>=0 || cardNo.indexOf("吉林省农村信用社")>=0 || cardNo.indexOf("山西省农村信用社")>=0){
		img=imgSRCi+"card/xin@2x.png";
	}else if(cardNo.indexOf("北京农商")>=0){
		img=imgSRCi+"card/bjrcb@2x.png";
	}else if(cardNo.indexOf("北京")>=0){
		img=imgSRCi+"card/bob@2x.png";
	}else if(cardNo.indexOf("成都")>=0){
		img=imgSRCi+"card/bocd@2x.png";
	}else if(cardNo.indexOf("洛阳")>=0){
		img=imgSRCi+"card/boly@2x.png";
	}else if(cardNo.indexOf("江西")>=0){
		img=imgSRCi+"card/bonc@2x.png";
	}else if(cardNo.indexOf("上海")>=0){
		img=imgSRCi+"card/bos@2x.png";
	}else if(cardNo.indexOf("厦门")>=0){
		img=imgSRCi+"card/boxm@2x.png";
	}else if(cardNo.indexOf("长江")>=0){
		img=imgSRCi+"card/cjccb@2x.png";
	}else if(cardNo.indexOf("长安")>=0){
		img=imgSRCi+"card/chab@2x.png";
	}else if(cardNo.indexOf("招商")>=0){
		img=imgSRCi+"card/cmb@2x.png";
	}else if(cardNo.indexOf("重庆农商")>=0){
		img=imgSRCi+"card/cqrcb@2x.png";
	}else if(cardNo.indexOf("东营莱商村镇")>=0){
		img=imgSRCi+"card/dylscz@2x.png";
	}else if(cardNo.indexOf("德州")>=0){
		img=imgSRCi+"card/dzb@2x.png";
	}else if(cardNo.indexOf("广东南粤")>=0){
		img=imgSRCi+"card/gdnyb@2x.png";
	}else if(cardNo.indexOf("广州农商")>=0){
		img=imgSRCi+"card/grcb@2x.png";
	}else if(cardNo.indexOf("广州")>=0){
		img=imgSRCi+"card/gzcb@2x.png";
	}else if(cardNo.indexOf("杭州")>=0){
		img=imgSRCi+"card/hzb@2x.png";
	}else if(cardNo.indexOf("九江")>=0){
		img=imgSRCi+"card/jjccb@2x.png";
	}else if(cardNo.indexOf("江苏")>=0){
		img=imgSRCi+"card/jsb@2x.png";
	}else if(cardNo.indexOf("晋中")>=0){
		img=imgSRCi+"card/jzcb@2x.png";
	}else if(cardNo.indexOf("临商")>=0){
		img=imgSRCi+"card/lsb@2x.png";
	}else if(cardNo.indexOf("莱商")>=0){
		img=imgSRCi+"card/lwb@2x.png";
	}else if(cardNo.indexOf("宁波")>=0){
		img=imgSRCi+"card/nbcb@2x.png";
	}else if(cardNo.indexOf("南京")>=0){
		img=imgSRCi+"card/njcb@2x.png";
	}else if(cardNo.indexOf("鄂尔多斯")>=0){
		img=imgSRCi+"card/ordos@2x.png";
	}else if(cardNo.indexOf("齐商")>=0){
		img=imgSRCi+"card/qsb@2x.png";
	}else if(cardNo.indexOf("日照")>=0){
		img=imgSRCi+"card/rzb@2x.png";
	}else if(cardNo.indexOf("上海农商")>=0){
		img=imgSRCi+"card/srcb@2x.png";
	}else if(cardNo.indexOf("泰安市商业")>=0){
		img=imgSRCi+"card/tab@2x.png";
	}else if(cardNo.indexOf("潍坊")>=0){
		img=imgSRCi+"card/wfccb@2x.png";
	}else if(cardNo.indexOf("温州")>=0){
		img=imgSRCi+"card/wzcb@2x.png";
	}else if(cardNo.indexOf("龙江")>=0){
		img=imgSRCi+"card/bolj@2x.png";
	}else if(cardNo.indexOf("徽商")>=0){
		img=imgSRCi+"card/hsb@2x.png";
	}else if(cardNo.indexOf("汉口")>=0){
		img=imgSRCi+"card/hkb@2x.png";
	}else if(cardNo.indexOf("天津滨海农村商业")>=0){
		img=imgSRCi+"card/tjrcb@2x.png";
	}else if(cardNo.indexOf("包商")>=0){
		img=imgSRCi+"card/bsb@2x.png";
	}else if(cardNo.indexOf("东莞农村商业")>=0){
		img=imgSRCi+"card/drcb@2x.png";
	}else if(cardNo.indexOf("锦州")>=0){
		img=imgSRCi+"card/jzb@2x.png";
	}else if(cardNo.indexOf("武汉农村商业")>=0){
		img=imgSRCi+"card/whrcb@2x.png";
	}else if(cardNo.indexOf("东营")>=0){
		img=imgSRCi+"card/dyccb@2x.png";
	}else if(cardNo.indexOf("威海市商业")>=0){
		img=imgSRCi+"card/whccb@2x.png";
	}else if(cardNo.indexOf("攀枝花市商业")>=0){
		img=imgSRCi+"card/pahccb@2x.png";
	}else if(cardNo.indexOf("恒丰")>=0){////////////////////////////////////////////////////////////////////////
		img=imgSRCi+"card/pahccb@2x.png";
	}else if(cardNo.indexOf("江苏农村商业")>=0){
		img=imgSRCi+"card/jsnx@2x.png";
	}else if(cardNo.indexOf("济宁")>=0){
		img=imgSRCi+"card/bojn@2x.png";
	}else if(cardNo.indexOf("枣庄")>=0){
		img=imgSRCi+"card/bozz@2x.png";
	}else if(cardNo.indexOf("烟台")>=0){
		img=imgSRCi+"card/ytcb@2x.png";
	}else if(cardNo.indexOf("保定")>=0){
		img=imgSRCi+"card/bobd@2x.png";
	}else if(cardNo.indexOf("渤海")>=0){
		img=imgSRCi+"card/cbhb@2x.png";
	}else if(cardNo.indexOf("贵阳")>=0){
		img=imgSRCi+"card/bogy@2x.png";
	}else if(cardNo.indexOf("兰州")>=0){
		img=imgSRCi+"card/lzcb@2x.png";
	}else if(cardNo.indexOf("营口")>=0){
		img=imgSRCi+"card/boyk@2x.png";
	}else if(cardNo.indexOf("浙江泰隆")>=0){
		img=imgSRCi+"card/zjtlcb@2x.png";
	}else if(cardNo.indexOf("桂林")>=0){
		img=imgSRCi+"card/bogl@2x.png";
	}else if(cardNo.indexOf("新韩")>=0){
		img=imgSRCi+"card/shbank@2x.png";
	}else if(cardNo.indexOf("盘锦")>=0){
		img=imgSRCi+"card/boyk@2x.png";
	}else if(cardNo.indexOf("张家口")>=0){
		img=imgSRCi+"card/zjkccb@2x.png";
	}else if(cardNo.indexOf("西安")>=0){
		img=imgSRCi+"card/boxia@2x.png";
	}else if(cardNo.indexOf("天津农商")>=0){
		img=imgSRCi+"card/tjrcb@2x.png";
	}else if(cardNo.indexOf("青岛")>=0){
		img=imgSRCi+"card/qdccb@2x.png";
	}
	return img;
}

//点击获取验证码倒计时
var curCount;//当前剩余秒数
function sign(){
	$(".sign_next_again").css("display","none");
	$(".sign_next_time").css("display","inline-block").hover(function(){
	    $(".sign_next_time").css("color","#333");
	});
	var InterValObj; //timer变量，控制时间
	var count = 59; //间隔函数，1秒执行
	
	function sendMessage(){
		curCount=parseInt(count);
		//设置button效果，开始计时
	     $(".sign_time").text(curCount);
	     InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
	     //手机验证码         向后台发送处理数据
	     
	};
	//timer处理函数
	function SetRemainTime() {
        if(curCount == 0){      
        	$(".sign_next_again").removeAttr("disabled");
            window.clearInterval(InterValObj);//停止计时器
            $(".sign_next_time").css("display","none");
            $(".sign_next_again").css("display","inline-block");
            $(".sign_next_again").text("重新获取");
        }
        else {
            curCount--;
            $(".sign_time").text(curCount);
        }
    };
    sendMessage();
}

