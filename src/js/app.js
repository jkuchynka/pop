angular.module('app', ['ngRoute', 'ngAnimate'])

.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: '/views/home.html'
    })
    .when('/about/', {
      controller: 'AboutCtrl',
      templateUrl: '/views/about.html'
    })
    .when('/contact/', {
      controller: 'ContactCtrl',
      templateUrl: '/views/contact.html'
    })
    .when('/login/', {
      controller: 'LoginCtrl',
      templateUrl: '/views/login.html'
    })
    .when('/user/:username', {
      controller: 'UserCtrl',
      templateUrl: '/views/user.html'
    })
    .otherwise({
      redirectTo: '/'
    });
})

.run(function ($rootScope, AuthService) {
  $rootScope.greeting = 'Hello world!';
  // Load up the currently logged in user from the server
  // @todo: Load from local storage first for quicker page draw?
  AuthService.loadCurrentUser();
});
