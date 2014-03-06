angular.module('app', ['ngRoute', 'ngAnimate'])

.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeCtrl',
            templateUrl: 'views/home.html'
        })
        .when('/about/', {
            controller: 'AboutCtrl',
            templateUrl: 'views/about.html'
        })
        .when('/contact/', {
            controller: 'ContactCtrl',
            templateUrl: 'views/contact.html'
        });
})

.run(function ($rootScope) {
    $rootScope.greeting = 'Hello world!';
});