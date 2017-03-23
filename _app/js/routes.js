var routes = angular.module('routes', ['ui.router', 'oc.lazyLoad']);
routes.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider){
    $stateProvider.state('layout', {
        url: '',
        abstract: true,
        views: {
            "": {
                templateUrl: "views/app.html"
            }
        },
        controller:''
        //,
        //resolve: {
        //    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        //        return $ocLazyLoad.load(['js/controllers/warmUpController.js']);
        //    }]
        //}
    }).state('layout.app',{
        url:'/app',
        views:{
            '':{
                template:'<div ng-view></div>'
            },
            'header':{
                templateUrl:'views/header.html',
                controller:''
            }
        }
    })
     $urlRouterProvider.otherwise('/');
}]);