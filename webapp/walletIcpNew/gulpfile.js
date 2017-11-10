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
var imagemin = require('gulp-imagemin');//压缩图片
var pngquant = require('imagemin-pngquant'); //png图片压缩插件
var livereload = require('gulp-livereload');//自动刷新页面
//加载gulp-load-plugins插件，并马上运行它
var plugins = require('gulp-load-plugins')();

var ngAnnotate = require("gulp-ng-annotate");		//angular
var ngmin = require("gulp-ngmin");

var stripDebug = require('gulp-strip-debug');

var ngAnnotate = require('gulp-ng-annotate'); 


//css
gulp.task('minify-css', function () {
    gulp.src('src/css/*.css')
    	.pipe(concat('common.css'))
        .pipe(minifyCss())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/css/'));
});
//压缩js
gulp.task('script', function () {
	var jsSrc = ['src/js/config.js'],
		jsDst = 'build/js/'
    gulp.src(jsSrc)
        //.pipe(concat('all.js'))
        .pipe(ngAnnotate())
    	.pipe(stripDebug())
        .pipe(uglify())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsDst));
	
	var jsSrc1 = ['src/js/aboutUsCtrl.js',
	              'src/js/chatChatCtrl.js',
	              'src/js/chatDetailsCtrl.js',
	              'src/js/detailsPageCtrl.js',
	              'src/js/joinChatCtrl.js',
	              'src/js/mainCtrl.js',
	              'src/js/shopDailyProvisionsMoreCtrl.js',
	              'src/js/shopDinksMoreCtrl.js',
	              'src/js/shopfastFoodMoreCtrl.js',
	              'src/js/shopSnackFoodMoreCtrl.js',
	              'src/js/ziXunZhongXinCtrl.js'];	
	gulp.src(jsSrc1)
		.pipe(ngAnnotate())
		.pipe(stripDebug())
	    .pipe(concat('all.js'))
	    .pipe(uglify())
	    .pipe(plugins.rename({ suffix: '.min' }))
	    .pipe(gulp.dest(jsDst));
});
//gulp-ng-annotate 支持ng依赖注入声明方式
gulp.task('build-app-js', function () {
	var jsBaseSrc = ['src/js/base/*.js'],
		jsBaseDst = 'build/js/base/';
    return gulp.src('jsBaseSrc')
        .pipe(ngAnnotate({single_quotes: true}))
        .pipe(gulp.dest('jsBaseDst'))
});
//images
gulp.task('imagemin', function () {
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
	
	//shop
	var imgPiblicSrc = ['src/img/shop'],
		imgPiblicDst = 'build/img/shop';
	gulp.src(imgPiblicSrc)
	    .pipe(imagemin({
	        progressive: true,
	        use: [pngquant()] //使用pngquant来压缩png图片
	    }))
	    .pipe(gulp.dest(imgPiblicDst));
});
gulp.task('default',['minify-css','script','imagemin'],function(){
	//console.log("gulp is doing");
}); 