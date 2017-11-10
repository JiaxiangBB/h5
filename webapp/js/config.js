var app =  angular.module("myapp",["ui.router","LocalStorageModule"]);
app.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){  
    $urlRouterProvider.otherwise("/login");  
    
    //.. 删除#号省略代码
    //$locationProvider.html5Mode(true);

    $stateProvider.state("login",{ //登录        //名字
        url:"/login",                           //目录
        templateUrl:"views/login.html",         //文件路径
        controller:"login"
    })//快速注册
    .state("wrap.register",{//对视图的引用
        url:"/register",//地址栏中会看到的信息
        templateUrl:"views/register.html",     // 解析的页面路径
        controller:"register",   //控制器，可解析参数
        data:{//设置title值
            "title":"register"
        }
    })//立即登录
    .state("wrap.immediately_login",{//对视图的引用
        url:"/immediately_login",//地址栏中会看到的信息
        templateUrl:"views/immediately_login.html",     // 解析的页面路径
        controller:"immediately_login",   //控制器，可解析参数
        data:{//设置title值
            "title":"immediately_login"
        }
    })//找回登录密码
    .state("wrap.password",{//对视图的引用
        url:"/password",//地址栏中会看到的信息
        templateUrl:"views/password.html",     // 解析的页面路径
        controller:"password",   //控制器，可解析参数
        data:{//设置title值
            "title":"password"
        }
    })//首页
    .state("wrap",{                            //名字
        url:"/wrap/:publicStr",                           //目录
        templateUrl:"views/wrap.html",         //文件路径
        controller:"wrap",                     //绑定控制器
       /* cache:'false',                         //清除缓存
*/        data:{//设置title值
         "title":"wrap"
        }
    })//首页信息
    .state("wrap.main",{//对视图的引用
        url:"/main",//地址栏中会看到的信息
        templateUrl:"views/main.html",     // 解析的页面路径
        controller:"main",   //控制器，可解析参数
        data:{//设置title值
         "title":"main"
        }
    })//客户端下载
    .state("wrap.client",{//对视图的引用
        url:"/client",//地址栏中会看到的信息
        templateUrl:"views/client.html",     // 解析的页面路径
        controller:"client",   //控制器，可解析参数
        data:{//设置title值
         "title":"client"
        }
    })//消息
    .state("wrap.news",{//对视图的引用
        url:"/news",//地址栏中会看到的信息
        templateUrl:"views/news.html",     // 解析的页面路径
        controller:"news",   //控制器，可解析参数
        data:{//设置title值
         "title":"news"
        }
    })//实名认证
    .state("wrap.approve",{//对视图的引用
        url:"/approve/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/approve.html",     // 解析的页面路径
        controller:"approve",   //控制器，可解析参数
        data:{//设置title值
         "title":"approve"
        }
    })//安全管理
    .state("wrap.safety",{//对视图的引用
        url:"/safety/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/safety.html",     // 解析的页面路径
        controller:"safety",   //控制器，可解析参数
        data:{//设置title值
         "title":"safety"
        }
    })//优惠券
    .state("wrap.coupons",{//对视图的引用
        url:"/coupons/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/coupons.html",     // 解析的页面路径
        controller:"coupons",   //控制器，可解析参数
        data:{//设置title值
         "title":"coupons"
        }
    })//交易明细
    .state("wrap.trading",{//对视图的引用
        url:"/trading/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/trading.html",     // 解析的页面路径
        controller:"trading",   //控制器，可解析参数
        data:{//设置title值
         "title":"trading"
        }
    })//交易详情
    .state("wrap.detail",{//对视图的引用
        url:"/detail/:moneyStr/:detailStr",//地址栏中会看到的信息
        templateUrl:"views/detail.html",     // 解析的页面路径
        controller:"detail",   //控制器，可解析参数
        data:{//设置title值
        	"title":"detail"
        }
    })//转账
    .state("wrap.transfer",{//对视图的引用
        url:"/transfer/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/transfer.html",     // 解析的页面路径
        controller:"addBank",   //控制器，可解析参数
        data:{//设置title值
         "title":"transfer"
        }
    })//全时通卡充值
    .state("wrap.recharge",{//对视图的引用
        url:"/recharge/:moneyStr/:cardStr/:cimg",//地址栏中会看到的信息
        templateUrl:"views/recharge.html",     // 解析的页面路径
        controller:"recharge",   //控制器，可解析参数
        data:{//设置title值
         "title":"recharge"
        }
    })
    //账户充值
    .state("wrap.prepaid",{//对视图的引用
        url:"/prepaid/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/prepaid.html",     // 解析的页面路径
        controller:"addBank",   //控制器，可解析参数
        data:{//设置title值
         "title":"prepaid"
        }
    })//提现
    .state("wrap.deposit",{//对视图的引用
        url:"/deposit/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/deposit.html",     // 解析的页面路径
        controller:"addBank",   //控制器，可解析参数
        data:{//设置title值
         "title":"deposit"
        }
    })//申请电子卡
    .state("wrap.apply",{//对视图的引用
        url:"/apply/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/apply.html",     // 解析的页面路径
        controller:"apply",   //控制器，可解析参数
        data:{//设置title值
         "title":"apply"
        }
    })//添加全时通卡
    .state("wrap.add",{//对视图的引用
        url:"/add/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/add.html",     // 解析的页面路径
        controller:"addBank",   //控制器，可解析参数
        data:{//设置title值
         "title":"add"
        }
    })//全时通卡列表
    .state("wrap.list",{//对视图的引用
        url:"/list/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/list.html",     // 解析的页面路径
        controller:"addBank",   //控制器，可解析参数
        data:{//设置title值
         "title":"list"
        }
    })//添加银行卡
    .state("wrap.addBank",{//对视图的引用
        url:"/addBank/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/addBank.html",     // 解析的页面路径
        controller:"addBank",   //控制器，可解析参数
        data:{//设置title值
         "title":"addBank"
        }
    })//信用卡还款
    .state("wrap.refund",{//对视图的引用
        url:"/refund",//地址栏中会看到的信息
        templateUrl:"views/refund.html",     // 解析的页面路径
        controller:"refund",   //控制器，可解析参数
        data:{//设置title值
         "title":"refund"
        }
    })//银行卡列表
    .state("wrap.listBank",{//对视图的引用
        url:"/listBank/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/listBank.html",     // 解析的页面路径
        controller:"addBank",   //控制器，可解析参数
        data:{//设置title值
         "title":"listBank"
        }
    })//关于我们
    .state("wrap.about",{//对视图的引用
        url:"/about",//地址栏中会看到的信息
        templateUrl:"views/about.html",// 解析的页面路径
        controller:"about",//控制器，可解析参数
        data:{//设置title值
         "title":"about"
        }
    })//新手指引
    .state("wrap.guild",{//对视图的引用
        url:"/guild",//地址栏中会看到的信息
        templateUrl:"views/guild.html",// 解析的页面路径
        controller:"guild",//控制器，可解析参数
        data:{//设置title值
         "title":"guild"
        }
    })//帮助中心
    .state("wrap.help",{//对视图的引用
        url:"/help",//地址栏中会看到的信息
        templateUrl:"views/help.html",// 解析的页面路径
        controller:"help",//控制器，可解析参数
        data:{//设置title值
         "title":"help"
        }
    })//设置支付密码
    .state("wrap.payPassword",{//对视图的引用
        url:"/payPassword/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/payPassword.html",// 解析的页面路径
        controller:"payPassword",//控制器，可解析参数
        data:{//设置title值
         "title":"payPassword"
        }
    })//忘记支付密码
    .state("wrap.resetPsw",{//对视图的引用
        url:"/resetPsw/:moneyStr",//地址栏中会看到的信息
        templateUrl:"views/resetPsw.html",// 解析的页面路径
        controller:"resetPsw",//控制器，可解析参数
        data:{//设置title值
         "title":"resetPsw"
        }
    });  
}]);  

    