var gulp = require('gulp');
var NwBuilder = require('nw-builder');

var util = require('gulp-util');

gulp.task('app', function () {
    var nw = new NwBuilder({
        version: '0.14.7',
        files: './dest/**',
        winIco: "./icons/logo_bird.ico",
        macIcns: './icons/icon.icns',
        macPlist: {mac_bundle_id: 'xcaseEditorPkg'},
        buildDir: './buildApp',
        platforms: ['win32']/*['osx64', 'linux', 'win32']*/
    });
    // Log stuff you want
    nw.on('log', function (msg) {
        util.log('nw-builder buildApp', msg);
    });

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build().catch(function (err) {
        util.log('err: nw-builder buildApp:', err);
    });
});