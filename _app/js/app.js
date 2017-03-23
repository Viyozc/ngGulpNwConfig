var app = angular.module('myApp', ['ui.bootstrap', 'directives', 'services', 'routes', 'filters']);
app.config(['$ocLazyLoadProvider', '$compileProvider', function($ocLazyLoadProvider, $compileProvider) {
    // 解决 nw 中 图片无法正常显示问题
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file:chrome-extension):/);
}]);
app.run(['$rootScope', '$window', 'cube', 'audio', '$timeout', function($rootScope, $window, cube, audio, $timeout){
    $rootScope._cube = cube;
    $rootScope._audio = audio;
    $rootScope.back = function () {
        $window.history.back();
    };
    $rootScope._loading = {
        // loading, fail
        state: '',
        desc: '',
        loading: function (desc = '加载中...') {
            $rootScope._loading.state = 'loading';
            if (desc) {
                $rootScope._loading.desc = desc;
            }
        },
        finish: function () {
            $timeout(function () {
                $rootScope._loading.state = '';
            })
        },
        fail: function () {
            $timeout(function () {
                this.state = 'fail'
            })
        }
    };
    $rootScope._modal = {
        type: '',
        toggle: false,
        title: '',
        desc: '',
        okText: '',
        cancelText: '',
        cancelCb: null,
        oKCb: null,
        "okDo": function () {
            this.oKCb && this.oKCb();
        },
        "cancelDo": function () {
            this.cancelCb && this.cancelCb();
        },
        showConfirm: function (title, desc, okDo, cancelDo, okText = '确定', cancelText = '取消') {
            $rootScope._modal.type = 'confirm';
            $rootScope._modal.title = title;
            $rootScope._modal.desc = desc;
            $rootScope._modal.okText = okText;
            $rootScope._modal.cancelText = cancelText;
            $rootScope._modal.oKCb = okDo;
            $rootScope._modal.cancelCb = cancelDo;
            $rootScope._modal.toggle = true;
        },
        showAlert: function (title, desc, okDo, okText = '确定') {
            $rootScope._modal.type = 'alert';
            $rootScope._modal.title = title;
            $rootScope._modal.desc = desc;
            $rootScope._modal.okText = okText;
            $rootScope._modal.oKCb = okDo;
            $rootScope._modal.toggle = true;
        }
    };

    // 播放背景音乐
    //audio.playBg('../assets/audio/bgm.mp3', true);
    !function appOnClose() {
        var gui = require('nw.gui');
        var win = gui.Window.get();
        win.on('close', function() {
            this.hide();
            require('nw.gui').App.clearCache();
            // 复位主机
            cube.manager.reset();
            setTimeout(function () {
                gui.Window.get().close(true);
            }, 1500);
        });
    }();
}]);


// setTimeout(function () {
//     $scope.$evalAsync(function () {
//         $scope.a = 1;
//     })
// })