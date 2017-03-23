var routes = angular.module('routes', ['ui.router', 'oc.lazyLoad']);
routes.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider){
    $stateProvider
        .state('layout', {
        url:'',
        templateUrl:'views/app.html'
    })
    .state('layout.app',{
            url:'/app',
            views:{
                '':{
                    templateUrl:'views/footer.html'
                },
                'header':{
                    templateUrl:'views/header.html'
                },
                'footer':{
                    templateUrl:'views/footer.html'
                }
            }
        })
     $urlRouterProvider.otherwise('/app');
}]);