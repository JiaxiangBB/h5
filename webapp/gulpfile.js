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
var	webserver = require("gulp-webserver");
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
//var cssmin = require('gulp-cssmin');
/*一些gulp插件*/
var minifyCss = require("gulp-minify-css");
var uglify = require('gulp-uglify');//压缩JS代码
var concat = require('gulp-concat');//合并JS文件
//var imagemin = require('gulp-imagemin');//压缩图片
var pngquant = require('imagemin-pngquant'); //png图片压缩插件
var livereload = require('gulp-livereload');//自动刷新页面
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();

var ngAnnotate = require("gulp-ng-annotate");		//angular
var ngmin = require("gulp-ngmin");

var stripDebug = require('gulp-strip-debug');


//加载gulp-load-plugins插件，并马上运行它
//var plugins = require('gulp-load-plugins')();
//gulp.task("webserver",function(){
//	gulp.src("../")
//		.pipe(webserver({
//			open:"http://localhost/index.html",
//			port:80
//		}));
//});
//压缩文件 html
gulp.task('minify-html', function () {
    gulp.src('views/*.html') // 要压缩的html文件
    .pipe(minifyHtml()) //压缩
    .pipe(gulp.dest('build/views'));
});
//css
gulp.task('minify-css', function () {
    gulp.src('css/*.css')
    	.pipe(concat('common.css'))
        .pipe(minifyCss())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/css/'));
});
//压缩js
gulp.task('script', function () {
	var jsSrc = ['js/config.js'],
		jsDst = 'build/js/'
    gulp.src(jsSrc)
        //.pipe(concat('all.js'))
    	.pipe(stripDebug())
        .pipe(uglify())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsDst));
	
	var jsSrc1 = ['js/aboutController.js',
	              'js/addBankController.js',
	              'js/applyController.js',
	              'js/approveController.js',
	              'js/clientController.js',
	              'js/couponsController.js',
	              'js/detailController.js',
	              'js/guildController.js',
	              'js/helpController.js',
	              'js/loginController.js',
	              'js/mainController.js',	
	              'js/passwordController.js',	
	              'js/payPasswordController.js',
	              'js/rechargeController.js',	
	              'js/registerController.js',	
	              'js/resetPswController.js',	
	              'js/safetyController.js',	
	              'js/tradingController.js',	
	              'js/wrapController.js'];	
	gulp.src(jsSrc1)
		.pipe(stripDebug())
	    .pipe(concat('all.js'))
	    .pipe(uglify())
	    .pipe(plugins.rename({ suffix: '.min' }))
	    .pipe(gulp.dest(jsDst));
});
//gulp-ng-annotate 支持ng依赖注入声明方式
//gulp.task('build-app-js', function () {
//	var jsBaseSrc = ['src/js/base/*.js'],
//		jsBaseDst = 'build/js/base/';
//    return gulp.src('jsBaseSrc')
//        .pipe(ngAnnotate({single_quotes: true}))
//        .pipe(gulp.dest('jsBaseDst'))
//});
//images
/*gulp.task('imagemin', function () {
	//balance
	var imgBalanceSrc = ['src/img/balance/*'],
		imgBalanceDst = 'build/img/balance';
    gulp.src(imgBalanceSrc)
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest(imgBalanceDst));
    //card
    var imgCardSrc = ['src/img/card/*'],
    	imgCardDst = 'build/img/card';
    gulp.src(imgCardSrc)
	    .pipe(imagemin({
	        progressive: true,
	        use: [pngquant()] //使用pngquant来压缩png图片
	    }))
	    .pipe(gulp.dest(imgCardDst));
    //cardBg
    var imgCardBgSrc = ['src/img/cardBg/*'],
		imgCardBgDst = 'build/img/cardBg';
	gulp.src(imgCardBgSrc)
	    .pipe(imagemin({
	        progressive: true,
	        use: [pngquant()] //使用pngquant来压缩png图片
	    }))
	    .pipe(gulp.dest(imgCardBgDst));
	//first
	var imgFirstBgSrc = ['src/img/first/*'],
		imgFirstBgDst = 'build/img/first';
	gulp.src(imgFirstBgSrc)
	    .pipe(imagemin({
	        progressive: true,
	        use: [pngquant()] //使用pngquant来压缩png图片
	    }))
	    .pipe(gulp.dest(imgFirstBgDst));
	//login
	var imgLoginSrc = ['src/img/login/*'],
		imgLoginDst = 'build/img/login';
	gulp.src(imgLoginSrc)
	    .pipe(imagemin({
	        progressive: true,
	        use: [pngquant()] //使用pngquant来压缩png图片
	    }))
	    .pipe(gulp.dest(imgLoginDst));
	
	//piblic
	var imgPiblicSrc = ['src/img/piblic'],
		imgPiblicDst = 'build/img/piblic';
	gulp.src(imgPiblicSrc)
	    .pipe(imagemin({
	        progressive: true,
	        use: [pngquant()] //使用pngquant来压缩png图片
	    }))
	    .pipe(gulp.dest(imgPiblicDst));
	//remind
	var imgRemindSrc = ['src/img/remind/*'],
		imgRemindDst = 'build/img/remind';
	gulp.src(imgRemindSrc)
	    .pipe(imagemin({
	        progressive: true,
	        use: [pngquant()] //使用pngquant来压缩png图片
	    }))
	    .pipe(gulp.dest(imgRemindDst));
	//use
	var imgUseSrc = ['src/img/use/*'],
		imgUseDst = 'build/img/use';
	gulp.src(imgUseSrc)
	    .pipe(imagemin({
	        progressive: true,
	        use: [pngquant()] //使用pngquant来压缩png图片
	    }))
	    .pipe(gulp.dest(imgUseDst));
});*/
gulp.task('default',['minify-css','script'],function(){
	//console.log("gulp is doing");
}); 