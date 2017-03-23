'use strict';
// https://www.npmjs.com/package/gulp-sass/
// npm install gulp-sass --save-dev
var gulp = require('gulp');

var copyConfig = require('../config').copy;

gulp.task('copy', function () {
    gulp.src(copyConfig.cp1.src)
        .pipe(gulp.dest(copyConfig.cp1.dest));

    gulp.src(copyConfig.cp2.src)
        .pipe(gulp.dest(copyConfig.cp2.dest));

    gulp.src(copyConfig.cp3.src)
        .pipe(gulp.dest(copyConfig.cp3.dest));
});