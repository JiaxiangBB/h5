/*引入gulp及相关插件 require('node_modules里对应模块')*/
//sass的编译（gulp-sass）
//less编译 （gulp-less）
//重命名（gulp-rename）
//自动添加css前缀（gulp-autoprefixer）
//压缩css（gulp-clean-css）
//js代码校验（gulp-jshint）
//合并js文件（gulp-concat）
//压缩js代码（gulp-uglify）
//压缩图片（gulp-imagemin）
//自动刷新页面（gulp-livereload，谷歌浏览器亲测，谷歌浏览器需安装livereload插件）
//图片缓存，只有图片替换了才压缩（gulp-cache）
//更改提醒（gulp-notify）
var gulp = require('gulp');
// var	webserver = require("gulp-webserver");
// var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
//var cssmin = require('gulp-cssmin');
/*一些gulp插件*/
var minifyCss = require("gulp-minify-css");
var uglify = require('gulp-uglify');//压缩JS代码
var concat = require('gulp-concat');//合并JS文件
var imagemin = require('gulp-imagemin');//压缩图片
var pngquant = require('imagemin-pngquant'); //png图片压缩插件
var livereload = require('gulp-livereload');//自动刷新页面
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();

var ngAnnotate = require("gulp-ng-annotate");		//angular
var ngmin = require("gulp-ngmin");

var stripDebug = require('gulp-strip-debug');

// gulp.task('minify-html', function () {
//     gulp.src('views/*.html') // 要压缩的html文件
//     .pipe(minifyHtml()) //压缩
//     .pipe(gulp.dest('build/views'));
// });
//css
gulp.task('minify-css', function () {
    gulp.src('css/style.css')
    	.pipe(concat('common.css'))
        .pipe(minifyCss())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/css/'));
});
//压缩图片
gulp.task('imagemin', function () {
	var imgSrc = ['h5images/*.png'],
		imgDst = 'build/h5images/';
    gulp.src(imgSrc)
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest(imgDst));
});
//压缩js
gulp.task('script', function () {
	var jsSrc = ['js/app.js'],
		jsDst = 'build/js/'
    gulp.src(jsSrc)
        //.pipe(concat('all.js'))
    	.pipe(stripDebug())
        .pipe(uglify())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsDst));
	
	var jsSrc2 = ['js/jq.js']
    gulp.src(jsSrc2)
        //.pipe(concat('all.js'))
    	.pipe(stripDebug())
        .pipe(uglify())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsDst));

    var jsSrc3 = ['js/public.js']
    gulp.src(jsSrc3)
        //.pipe(concat('all.js'))
    	.pipe(stripDebug())
        .pipe(uglify())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsDst));

    var jsSrc4 = ['js/payWayCtrl.js']
    gulp.src(jsSrc4)
        //.pipe(concat('all.js'))
    	.pipe(stripDebug())
        .pipe(uglify())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsDst));

	var jsSrc1 = ['views/accountBalance/accountBalanceCtrl.js',
	              'views/accountBalance/bankPhoneCodeCtrl.js',
	              'views/accountBalance/transactionDetailsCtrl.js',
	              'views/addBank/addBankCtrl.js',
	              'views/addBank/agreementCtrl.js',
	              'views/addBank/bankListCtrl.js',
	              'views/addBank/supportCtrl.js',
	              'views/applyCard/applyCardCtrl.js',
	              'views/applyCard/applyCardListCtrl.js',
	              'views/applyCard/applyCardRecordsCtrl.js',
	              'views/applyCard/applyOrderCtrl.js',	
	              'views/applyCard/applyPayPasswordCtrl.js',	
	              'views/applyCard/applySuccessCtrl.js',
	              'views/applyCard/informationCtrl.js',	
	              'views/applyCard/instructionsCtrl.js',	
	              'views/applyCreditCard/applyCreditCardCtrl.js',	
	              'views/billList/billListCtrl.js',	
	              'views/cardBalanceQuery/cardBalanceQueryCtrl.js',	
	              'views/coupons/couponsCtrl.js',
	              'views/fullTimeCard/addFullCardCtrl.js',
	              'views/fullTimeCard/balanFullTimeCardCtrl.js',
	              'views/fullTimeCard/fullCardTraDetailsCtrl.js',
	              'views/fullTimeCard/fullTimeCardCtrl.js',
	              'views/fullTimeCard/rechfullTimeCardCtrl.js',
	              'views/home/imageJs.js',
	              'views/inviteCode/inviteCodeCtrl.js',
	              'views/phoneRecharge/payMessageCtrl.js',
	              'views/phoneRecharge/payMessageFlowCtrl.js',
	              'views/phoneRecharge/payPasswordCtrl.js',
	              'views/phoneRecharge/payPasswordFlowCtrl.js',
	              'views/phoneRecharge/phoneRechargeCtrl.js',
	              'views/phoneRecharge/phoneRechargeRecordsCtrl.js',
	              'views/phoneRecharge/topUpSuccessCtrl.js',
	              'views/setPayPswd/setPayPswdCtrl.js',
	              'views/settings/changePayPassCtrl.js',
	              'views/settings/comProblemsCtrl.js',
	              'views/settings/findPayPassCtrl.js',
	              'views/settings/passwordSetCtrl.js',
	              'views/settings/personalInforCtrl.js',
	              'views/settings/realNameAuthCtrl.js',
	              'views/settings/settingsCtrl.js',
	              'views/sweepTheYard/sweepTheYardCtrl.js',
	              'views/transfer/transferCtrl.js',
	              'views/transfer/transferPasswordCtrl.js',
	              'views/transfer/transferRecordsCtrl.js',
	              'views/transfer/transferSuccessCtrl.js',
	              'views/transferTowallet/transferTowalletCtrl.js',
	              'views/waterElectricityFuelGas/billingDetailsCtrl.js',
	              'views/waterElectricityFuelGas/cityChangesCtrl.js',
	              'views/waterElectricityFuelGas/institutionsListCtrl.js',
	              'views/waterElectricityFuelGas/jiaofeiRecordCtrl.js',
	              'views/waterElectricityFuelGas/paymentConfirmCtrl.js',
	              'views/waterElectricityFuelGas/paymentMessageCtrl.js',
	              'views/waterElectricityFuelGas/paymentPasswordCtrl.js',
	              'views/waterElectricityFuelGas/paymentRecordsCtrl.js',
	              'views/waterElectricityFuelGas/paymentSuccessCtrl.js',
	              'views/waterElectricityFuelGas/waterAgreementCtrl.js',
	              'views/waterElectricityFuelGas/waterElectricityFuelGasCtrl.js'
	              ];	
	gulp.src(jsSrc1)
		.pipe(stripDebug())
	    .pipe(concat('all.js'))
	    .pipe(uglify())
	    .pipe(plugins.rename({ suffix: '.min' }))
	    .pipe(gulp.dest(jsDst));
});
gulp.task('default',['minify-css','script','imagemin'],function(){
	//console.log("gulp is doing");
}); 