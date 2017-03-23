var directives = angular.module('directives', []);
directives.directive('cModal', ['$timeout', function ($timeout) {
    return {
        restrict: "AE",
        templateUrl: 'views/components/cModal.html',
        scope: {
            className: '@cClass',
            cShow: '='
        },
        replace: true,
        transclude: true,
        link: function (scope, element) {
            "use strict";
            scope.$watch('cShow', function (newVal) {
                if (newVal){
                    $('body').addClass('modal-open');
                } else {
                    $('body').removeClass('modal-open');
                }
            });
            element.find('.modal-cancel').on('click', function () {
                scope.$apply(function () {
                    scope.cShow = false;
                });
            });

        }
    }
}]);

// directives.directive('wlpDecode', function() {
//     return {
//         restrict: 'CA',
//         scope: {
//             ngSrc: '@ngSrc'
//         },
//         link: function(scope, iElement, iAttrs, controller, transcludeFn) {
//             "use strict";
//             var src = scope.ngSrc;
//             if(src){
//                 WLPTool.decodeWlp(src, function (err, base64) {
//                    if(!err){
//                        $(iElement).attr("src", base64)
//                    }
//                 });
//             }
//
//         }
//     }
// });

directives.directive('cLoading', function () {
    return {
        restrict: 'CAE',
        templateUrl: 'views/components/cLoading.html',
        scope: {
            state: '@',
            desc: '@'
        },
        replace: true,
        link: function (scope, iElement) {
            scope.progressDesc = '加载中...';
            // if(scope.state == 'loading'){
            //     console.log(scope.desc);
            // }
            scope.$watch('desc', function (newVal) {
                if(newVal && scope.state == 'loading'){
                    scope.progressDesc = newVal;
                }
            });
        }
    }
});
directives.directive('cAlert', function () {
    return {
        restrict: 'CAE',
        templateUrl: 'views/components/cAlert.html',
        scope: {
            // confirm
            cAlert: '@',
            toggle: '=',
            title: '@',
            desc: '@',
            // 取消按钮文字 取消
            cancel: '@',
            cancelDo: '&',
            // 确定按钮文字 确定
            ok: '@',
            okDo: '&'
        },
        replace: true,
        link: function (scope, iElement, attrs) {
            scope.cancel = scope.cancel || '取消';
            scope.ok = scope.ok || '确定';

            scope.clickCancel =  function () {
                scope.toggle = false;
                scope.cancelDo();
            };
            scope.clickOk =  function () {
                scope.toggle = false;
                scope.okDo();
            }
        }
    }
});