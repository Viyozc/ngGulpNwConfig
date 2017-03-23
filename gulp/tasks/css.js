'use strict';
// https://www.npmjs.com/package/gulp-sass/
// npm install gulp-sass --save-dev
var gulp = require('gulp');
var sass = require('gulp-sass');

var cssConfig = require('../config').css;


// gulp.task('cssCopyOthers', function () {
//     return gulp.src(cssConfig.copyOthers.src)
//         .pipe(gulp.dest(cssConfig.copyOthers.dest));
// });

gulp.task('sass', function () {

    var autoprefixer = require('gulp-autoprefixer');

    return gulp.src(cssConfig.sass.src).pipe(sass.sync().on('error', sass.logError))
        .pipe(sass({outputStyle: 'compressed'}).on('error',  sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(cssConfig.sass.dest));
});