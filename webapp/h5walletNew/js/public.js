function adaptedText(){
	//font 适配
    var rem,window_w;
    function resetREM(){
        window_w = window.innerWidth;
        rem = window_w / 375 * 100;
        document.getElementsByTagName('html')[0].style.fontSize = rem + 'px';
    }
    resetREM();
    window.onresize = resetREM;
};
adaptedText();
////////////////////////////////////
function getRootPath(){   
    // var pathName = window.location.pathname.substring(1);   
    // var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));  
    // var str=window.location.host;
    // var rootPath;
    // if(str.substr(str.length-1,1)=="m"){
    //     rootPath = window.location.protocol + '//' + str;
    // }else{
    //   rootPath = window.location.protocol + '//' + str + '/'+ 'service';
    // }
    // return  rootPath;
    return window.location.protocol + '//' + window.location.host;
};
/////////////////////////////////
//输入支付密码动画
function payPassword(){
    var i=0;
    var timer=null;
    $('.mask_in p span').eq(0).addClass("mask_in_span");
    function myfun(id){
        $('.mask_in p span').eq(id).addClass("mask_in_span").siblings().removeClass("mask_in_span")
    }
    function auto(){
        if(i>=$('.mask_in p span').length)i=0;
        $('.mask_in p span').eq(0).addClass("mask_in_span").siblings().removeClass("mask_in_span");
        i++;    
        myfun(i);
    }timer=setInterval(auto,250)
};
//设置金额
function fmoney(s, n) { 
    n = n > 0 && n <= 20 ? n : 2; 
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + ""; 
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1],t = "";  
    for (i = 0; i < l.length; i++) { 
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : ""); 
    } 
    return t.split("").reverse().join("") + "." + r; 
} 
//定义时间参数
var date=new Date();
function getNowFormatDate(getFullYear) {
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;1
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = getFullYear + month + strDate;
    return currentdate;
}
//获取参数
var url = window.location.search;
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null;
};

//图片路径变量
var imgRrc="./";
//图片尺寸封装
var variable;
if(window.innerWidth < 414){
    variable="@2x";
}else if(window.innerWidth >=414){
    variable="@3x";
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
//短信验证码 倒计时封装函数
var curCount;//当前剩余秒数
var numBer=1;//判断是否显示重新获取
function sendMessage(){
    //alert("验证码")
    $(".sign_next_again").css("display","none");
    $(".sign_next_time").css("display","block");

    var InterValObj;//timer变量,控制时间
    var count = 60;//间隔函数,1秒执行
    function sendMsge(){
        curCount = parseInt(count);
        numBer = 1 ;
        //设置button效果，开始计时
        $(".sign_time").text(curCount);
        InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
        //手机验证码         向后台发送处理数据
    }
    //
    function SetRemainTime() {
        //console.log(curCount)
        if(curCount == 0){                
            window.clearInterval(InterValObj);//停止计时器
            if(numBer==0){
                
            }else{
                $(".sign_next_time").css("display","none");
                $(".sign_next_again").css("display","inline-block");
                $(".sign_next_again").text("重新获取");
            }
            
        }else {
            curCount--;
            $(".sign_time").text(curCount);
        }
    }
    sendMsge();
}
//URL解析参数
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); return null; 
} 
var loginName=getQueryString("loginname");
//console.log(loginName);
//登录接口 获取sessionId
function loginH5Host(){
    //alert(9)
    var parms = {};
    parms.loginname = loginName;//登录名
    parms.channel = "1001";//全时便利
    parms.token = "";
    
    var encryption = "loginname="+loginName+"&channel=1001"+"&token="+"";
    //console.log(md5("12345678").toUpperCase());
    //console.log(md5(encryption));
    var md5info=md5(encryption+"&"+md5("12345678").toUpperCase()).toUpperCase();
    //console.log(md5info);
    parms.md5info=md5info;

    $.ajax({
        url :getRootPath()+"/BusinessEntraceAction.loginH5Host.do?FAPView=JSON",
        data : parms,
        success : function(data) {  
            var data=$.parseJSON(data);
            console.log(data);
            var FAPErrorMessage = data.FAPErrorMessage;
            if(data.FAPStatus==0){
                //console.log(9)
                if(data.success==true){
                    var sessionId = data.data.sessionId;//sessionId
                    var payPwd = data.data.payPwd;//是否设置支付密码
                    var trueNameStatus = data.data.trueNameStatus;//是否实名
                    var customerName = data.data.customerName;//姓名
                    var mobile = data.data.mobile;//手机号
                    var certNo = data.data.certNo;//身份证号

                    //console.log(trueNameStatus);
                    localStorage.setItem("data",sessionId);//将sessionId存储到key字段
                    //var sessionId=localStorage.getItem("data");  
                    localStorage.setItem("payPwdData",payPwd);//将支付密码存储到key字段
                    //var payPwd=localStorage.getItem("payPwdData");  
                    localStorage.setItem("trueNameStatusData",trueNameStatus);//将 判断是否实名 储存到localStorage
                    //var trueName = localStorage.getItem("trueNameStatusData");  
                    //console.log(trueName);
                    localStorage.setItem("customerNameData",customerName);//姓名存储
                    localStorage.setItem("mobileData",mobile);//手机号存储
                    localStorage.setItem("certNoData",certNo);//身份证号
                }else{
                    var msg = data.errors.msg;
                    alert(msg)
                }
            }else if(data.FAPStatus==2){
                loginH5Host();
            }else if(data.FAPStatus==1){
                var msg = FAPErrorMessage;
                alert(msg)
            }
        },
        error:function(a,b,c){
//                  alert("错误");
        }                   
    });
}
//loginH5Host();
//封装判断银行卡样式
function bankCard(cardNo,img){
    if(cardNo.indexOf("工商")>=0){
        img=imgRrc+"h5images/icon_bank_zggsyh"+variable+".png";
    }else if(cardNo.indexOf("建设")>=0){
        img=imgRrc+"h5images/icon_bank_zgjsyh"+variable+".png";
    }else if(cardNo.indexOf("中国")>=0){
        img=imgRrc+"h5images/icon_bank_zgyh"+variable+".png";
    }else if(cardNo.indexOf("农业")>=0){
        img=imgRrc+"h5images/icon_bank_zgnyyh"+variable+".png";
    }else if(cardNo.indexOf("兴业")>=0){
        img=imgRrc+"h5images/icon_bank_xyyh"+variable+".png";
    }else if(cardNo.indexOf("光大")>=0){
        img=imgRrc+"h5images/icon_bank_zggdyh"+variable+".png";
    }else if(cardNo.indexOf("民生")>=0){
        img=imgRrc+"h5images/icon_bank_zgmsyh"+variable+".png";
    }else if(cardNo.indexOf("邮储")>=0||cardNo.indexOf("邮政储蓄")>=0){
        img=imgRrc+"h5images/icon_bank_zgyzcxyh"+variable+".png";
    }else if(cardNo.indexOf("中信")>=0){
        img=imgRrc+"h5images/icon_bank_zxyh"+variable+".png";
    }else if(cardNo.indexOf("平安")>=0){
        img=imgRrc+"h5images/icon_bank_payh"+variable+".png";
    }else if(cardNo.indexOf("交通")>=0){
        img=imgRrc+"h5images/icon_bank_jtyh"+variable+".png";
    }else if(cardNo.indexOf("华夏")>=0){
        img=imgRrc+"h5images/icon_bank_hxyh"+variable+".png";
    }else if(cardNo.indexOf("浦发")>=0){
        img=imgRrc+"h5images/icon_bank_pfyh"+variable+".png";
    }else if(cardNo.indexOf("广发")>=0){
        img=imgRrc+"h5images/icon_bank_gfyh"+variable+".png";
    }else if(cardNo.indexOf("农村信用社")>=0){
        img=imgRrc+"h5images/icon_bank_xin"+variable+".png";
    }else if(cardNo.indexOf("北京农商")>=0){
        img=imgRrc+"h5images/icon_bank_bjrcb"+variable+".png";
    }else if(cardNo.indexOf("北京")>=0){
        img=imgRrc+"h5images/icon_bank_bob"+variable+".png";
    }else if(cardNo.indexOf("成都")>=0){
        img=imgRrc+"h5images/icon_bank_bocd"+variable+".png";
    }else if(cardNo.indexOf("洛阳")>=0){
        img=imgRrc+"h5images/icon_bank_boly"+variable+".png";
    }else if(cardNo.indexOf("江西")>=0){
        img=imgRrc+"h5images/icon_bank_bonc"+variable+".png";
    }else if(cardNo.indexOf("上海")>=0){
        img=imgRrc+"h5images/icon_bank_bos"+variable+".png";
    }else if(cardNo.indexOf("厦门")>=0){
        img=imgRrc+"h5images/icon_bank_boxm"+variable+".png";
    }else if(cardNo.indexOf("长江")>=0){
        img=imgRrc+"h5images/icon_bank_cjccb"+variable+".png";
    }else if(cardNo.indexOf("长安")>=0){
        img=imgRrc+"h5images/icon_bank_chab"+variable+".png";
    }else if(cardNo.indexOf("招商")>=0){
        img=imgRrc+"h5images/icon_bank_zsyh"+variable+".png";
    }else if(cardNo.indexOf("重庆农商")>=0){
        img=imgRrc+"h5images/icon_bank_cqrcb"+variable+".png";
    }else if(cardNo.indexOf("东营莱商村镇")>=0){
        img=imgRrc+"h5images/icon_bank_dylscz"+variable+".png";
    }else if(cardNo.indexOf("德州")>=0){
        img=imgRrc+"h5images/icon_bank_dzb"+variable+".png";
    }else if(cardNo.indexOf("广东南粤")>=0){
        img=imgRrc+"h5images/icon_bank_gdnyb"+variable+".png";
    }else if(cardNo.indexOf("广州农商")>=0){
        img=imgRrc+"h5images/icon_bank_grcb"+variable+".png";
    }else if(cardNo.indexOf("广州")>=0){
        img=imgRrc+"h5images/icon_bank_gzcb"+variable+".png";
    }else if(cardNo.indexOf("杭州")>=0){
        img=imgRrc+"h5images/icon_bank_hzb"+variable+".png";
    }else if(cardNo.indexOf("九江")>=0){
        img=imgRrc+"h5images/icon_bank_jjccb"+variable+".png";
    }else if(cardNo.indexOf("江苏")>=0){
        img=imgRrc+"h5images/icon_bank_jsb"+variable+".png";
    }else if(cardNo.indexOf("晋中")>=0){
        img=imgRrc+"h5images/icon_bank_jzcb"+variable+".png";
    }else if(cardNo.indexOf("临商")>=0){
        img=imgRrc+"h5images/icon_bank_lsb"+variable+".png";
    }else if(cardNo.indexOf("莱商")>=0){
        img=imgRrc+"h5images/icon_bank_lwb"+variable+".png";
    }else if(cardNo.indexOf("宁波")>=0){
        img=imgRrc+"h5images/icon_bank_nbcb"+variable+".png";
    }else if(cardNo.indexOf("南京")>=0){
        img=imgRrc+"h5images/icon_bank_njcb"+variable+".png";
    }else if(cardNo.indexOf("鄂尔多斯")>=0){
        img=imgRrc+"h5images/icon_bank_ordos"+variable+".png";
    }else if(cardNo.indexOf("齐商")>=0){
        img=imgRrc+"h5images/icon_bank_qsb"+variable+".png";
    }else if(cardNo.indexOf("日照")>=0){
        img=imgRrc+"h5images/icon_bank_rzb"+variable+".png";
    }else if(cardNo.indexOf("上海农商")>=0){
        img=imgRrc+"h5images/icon_bank_srcb"+variable+".png";
    }else if(cardNo.indexOf("泰安市商业")>=0){
        img=imgRrc+"h5images/icon_bank_tab"+variable+".png";
    }else if(cardNo.indexOf("潍坊")>=0){
        img=imgRrc+"h5images/icon_bank_wfccb"+variable+".png";
    }else if(cardNo.indexOf("温州")>=0){
        img=imgRrc+"h5images/icon_bank_wzcb"+variable+".png";
    }else if(cardNo.indexOf("龙江")>=0){
        img=imgRrc+"h5images/icon_bank_bolj"+variable+".png";
    }else if(cardNo.indexOf("徽商")>=0){
        img=imgRrc+"h5images/icon_bank_hsb"+variable+".png";
    }else if(cardNo.indexOf("汉口")>=0){
        img=imgRrc+"h5images/icon_bank_hkb"+variable+".png";
    }else if(cardNo.indexOf("天津滨海农村商业")>=0){
        img=imgRrc+"h5images/icon_bank_tjrcb"+variable+".png";
    }else if(cardNo.indexOf("包商")>=0){
        img=imgRrc+"h5images/icon_bank_bsb"+variable+".png";
    }else if(cardNo.indexOf("东莞农村商业")>=0){
        img=imgRrc+"h5images/icon_bank_drcb"+variable+".png";
    }else if(cardNo.indexOf("锦州")>=0){
        img=imgRrc+"h5images/icon_bank_jzb"+variable+".png";
    }else if(cardNo.indexOf("武汉农村商业")>=0){
        img=imgRrc+"h5images/icon_bank_whrcb"+variable+".png";
    }else if(cardNo.indexOf("东营")>=0){
        img=imgRrc+"h5images/icon_bank_dyccb"+variable+".png";
    }else if(cardNo.indexOf("威海市商业")>=0){
        img=imgRrc+"h5images/icon_bank_whccb"+variable+".png";
    }else if(cardNo.indexOf("攀枝花市商业")>=0){
        img=imgRrc+"h5images/icon_bank_pahccb"+variable+".png";
    }else if(cardNo.indexOf("恒丰")>=0){////////////////////////////////////////////////////////////////////////
        img=imgRrc+"h5images/icon_bank_pahccb"+variable+".png";
    }else if(cardNo.indexOf("江苏农村商业")>=0){
        img=imgRrc+"h5images/icon_bank_jsnx"+variable+".png";
    }else if(cardNo.indexOf("济宁")>=0){
        img=imgRrc+"h5images/icon_bank_bojn"+variable+".png";
    }else if(cardNo.indexOf("枣庄")>=0){
        img=imgRrc+"h5images/icon_bank_bozz"+variable+".png";
    }else if(cardNo.indexOf("烟台")>=0){
        img=imgRrc+"h5images/icon_bank_ytcb"+variable+".png";
    }else if(cardNo.indexOf("保定")>=0){
        img=imgRrc+"h5images/icon_bank_bobd"+variable+".png";
    }else if(cardNo.indexOf("渤海")>=0){
        img=imgRrc+"h5images/icon_bank_cbhb"+variable+".png";
    }else if(cardNo.indexOf("贵阳")>=0){
        img=imgRrc+"h5images/icon_bank_bogy"+variable+".png";
    }else if(cardNo.indexOf("兰州")>=0){
        img=imgRrc+"h5images/icon_bank_lzcb"+variable+".png";
    }else if(cardNo.indexOf("营口")>=0){
        img=imgRrc+"h5images/icon_bank_boyk"+variable+".png";
    }else if(cardNo.indexOf("浙江泰隆")>=0){
        img=imgRrc+"h5images/icon_bank_zjtlcb"+variable+".png";
    }else if(cardNo.indexOf("桂林")>=0){
        img=imgRrc+"h5images/icon_bank_bogl"+variable+".png";
    }else if(cardNo.indexOf("新韩")>=0){
        img=imgRrc+"h5images/icon_bank_shbank"+variable+".png";
    }else if(cardNo.indexOf("盘锦")>=0){
        img=imgRrc+"h5images/icon_bank_boyk"+variable+".png";
    }else if(cardNo.indexOf("张家口")>=0){
        img=imgRrc+"h5images/icon_bank_zjkccb"+variable+".png";
    }else if(cardNo.indexOf("西安")>=0){
        img=imgRrc+"h5images/icon_bank_boxia"+variable+".png";
    }else if(cardNo.indexOf("天津农商")>=0){
        img=imgRrc+"h5images/icon_bank_tjrcb"+variable+".png";
    }else if(cardNo.indexOf("青岛")>=0){
        img=imgRrc+"h5images/icon_bank_qdccb"+variable+".png";
    }
    return img;
};