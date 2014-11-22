'use strict';

angular.module('app', [
  'ngResource', 'ngRoute', 'ngAnimate', 'ngSanitize', 'ngTable', 'angular-growl',
  'checklist-model', 'angularFileUpload', 'restangular', 'ui.bootstrap', 'ui.select'
])

.config(function (growlProvider) {
  growlProvider.globalTimeToLive(5000);
})

.config(function (RestangularProvider) {
  RestangularProvider.setBaseUrl('/api');
})

.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'HomeCtrl',
      templateUrl: '/assets/views/home.html'
    })
    .when('/about', {
      controller: 'AboutCtrl',
      templateUrl: '/assets/views/about.html'
    })
    .when('/contact', {
      controller: 'ContactCtrl',
      templateUrl: '/assets/views/forms/contact-form.html'
    })
    .when('/login', {
      controller: 'LoginCtrl',
      templateUrl: '/assets/views/forms/login-form.html'
    })
    .when('/user/new', {
      controller: 'FormUserCtrl',
      templateUrl: '/assets/views/forms/user-form.html',
      resolve: {
        mode: function () { return 'create'; }
      }
    })
    .when('/user/:username', {
      controller: 'UserCtrl',
      templateUrl: '/assets/views/user.html'
    })
    .when('/user/:userid/edit', {
      controller: 'FormUserCtrl',
      templateUrl: '/assets/views/forms/user-form.html',
      resolve: {
        mode: function () { return 'edit'; }
      }
    })
    .when('/admin', {
      controller: 'AdminCtrl',
      templateUrl: '/assets/views/admin/dashboard.html'
    })
    .when('/admin/permissions', {
      controller: 'AdminPermissionsCtrl',
      templateUrl: '/assets/views/admin/permissions.html'
    })
    .when('/admin/users', {
      controller: 'AdminUsersCtrl',
      templateUrl: '/assets/views/admin/users.html'
    })
    .when('/admin/roles', {
      controller: 'AdminRolesCtrl',
      templateUrl: '/assets/views/admin/roles.html'
    })
    .otherwise({
      redirectTo: '/'
    });
})

.run(function ($rootScope, AuthService) {
  $rootScope.showNav = false;
  $rootScope.toggleNav = function (pos) {
    if ( ! pos) {
      $rootScope.showNav = false;
    } else if ( ! $rootScope.showNav) {
      $rootScope.showNav = pos;
    } else {
      if ($rootScope.showNav == pos) {
        $rootScope.showNav = false;
      } else {
        $rootScope.showNav = pos;
      }
    }
  };
  $rootScope.bodyClass = function () {
    var classes = [];
    if ($rootScope.showNav) {
      classes.push('show-' + $rootScope.showNav + '-nav');
    }
    return classes;
  };
  $rootScope.title = '';
  $rootScope.pageTitle = function (title) {
    $rootScope.title = title;
    return $rootScope.title;
  };
  // Load up the currently logged in user from the server
  AuthService.loadCurrentUser().then(function (user) {
    console.log('Current user', user);
  });
  $rootScope.$on('$locationChangeStart', function (evt, next, current) {
    $rootScope.toggleNav();
    $rootScope.pageTitle('');
  });
});
