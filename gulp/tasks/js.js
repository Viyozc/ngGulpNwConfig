'use strict';
// http://www.ituring.com.cn/article/197923
// npm install gulp-uglify --save-dev
// npm install babel-preset-es2015 --save-dev
var gulp = require('gulp');

var plumber = require('gulp-plumber');

// var babelify = require('babelify');
var jsConfig = require('../config').js;

var babel  = require("gulp-babel");
/* _es6 */
gulp.task('es6ToEs5', function() {
    return gulp.src(jsConfig.es6ToEs5.src)
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(jsConfig.es6ToEs5.dest));
});

var stripDebug = require('gulp-strip-debug');
gulp.task('nodeModulesUglify', function () {
// 1. 找到文件
    gulp.src(jsConfig.nodeModulesUglify.src)
        .pipe(plumber())
        //1.1 删除console.log
        .pipe(stripDebug())
        // 2. 压缩文件
        // .pipe(uglify())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest(jsConfig.nodeModulesUglify.dest));
});