var filters = angular.module('filters', []);
filters.filter('localUrl', function () {
    return function (url, prefix = 'file://') {
        if(url.match(/^http/)){
            return prefix + $.path.autoLocalUrl(url);
        }
        return prefix + url;
    }
});

filters.filter('basename', function () {
    var path = require('path');
    return function (url) {
        return path.basename(url);
    }
});


filters.filter('repeat', function () {
    return function (num) {
        var arr = [];
        if(typeof num == 'number') {
            for(var i = 0; i< num; i++){
                arr.push(i);
            }
        }
        return arr;
    }
});