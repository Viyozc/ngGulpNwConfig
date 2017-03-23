'use strict';
// npm install --save-dev gulp-watch
var gulp = require('gulp');
var watch = require('gulp-watch');

var config = require('../config');

gulp.task('watch',['nodeModulesUglify','assets','copy' ,'es6ToEs5', 'sass', 'html'], function(){

    watch(config.copy.cp1.src, function () {
        gulp.run('copy');
    });

    watch(config.html.src, function () {
        gulp.run('html');
    });

    watch(config.js.es6ToEs5.src, function () {
        gulp.run('es6ToEs5');
    });

    watch(config.css.sass.src, function () {
        gulp.run('sass');
    });


    // watch(config.js.src, function () {
    //     gulp.run('js');
    // });

    // watch(config.html.src, function () {
    //     gulp.run('html');
    // });

    // watch(config.img.src, function () {
    //     gulp.run('img');
    // });
});
