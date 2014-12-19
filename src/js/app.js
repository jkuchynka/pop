
angular.module('app', [
    'ngRoute', 'ngAnimate', 'ngSanitize', 'ngTable', 'angular-growl',
    'checklist-model', 'angularFileUpload', 'restangular', 'ui.bootstrap', 'ui.select',
    'FormErrors', 'ui.router'
])

.config(function (growlProvider) {
    growlProvider.globalTimeToLive(5000);
})

.config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
})

.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
})

.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q) {
        return {
            request: function (config) {
                pop.spin(true);
                return config;
            },
            response: function (response) {
                pop.spin(false);
                return response;
            },
            responseError: function (rejection) {
                pop.spin(false);
                return $q.reject(rejection);
            }
        };
    });
})

.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'PagesHomeController',
            templateUrl: '/assets/views/pages/pages-home.html'
        })
        .when('/about', {
            controller: 'PagesAboutController',
            templateUrl: '/assets/views/pages/pages-about.html'
        })
        .when('/angularui-components', {
            controller: 'PagesComponentsAngularController',
            templateUrl: '/assets/views/pages/components/pages-components-angular.html'
        })
        .when('/bootstrap-components', {
            controller: function ($rootScope) {
                $rootScope.pageTitle('Bootstrap Components');
            },
            templateUrl: '/assets/views/pages/components/pages-components-bootstrap.html'
        })
        .when('/contact', {
            controller: 'PagesContactController',
            templateUrl: '/assets/views/pages/pages-contact.html'
        })
        .when('/login', {
            controller: 'UsersLoginController',
            templateUrl: '/assets/views/users/users-login.html'
        })
        .when('/register', {
            controller: 'UsersRegisterController',
            templateUrl: '/assets/views/users/users-register.html'
        })

        .when('/users/confirm/:confirmcode', {
            controller: 'UsersConfirmController',
            template: ''
        })
        .when('/users/reset/invalid', {
            controller: function ($rootScope) {
                $rootScope.pageTitle('Invalid Link');
            },
            templateUrl: '/assets/views/users/reset/users-reset-invalid.html'
        })
        .when('/users/reset/success', {
            controller: function ($rootScope) {
                $rootScope.pageTitle('Reset Password');
            },
            templateUrl: '/assets/views/users/reset/users-reset-success.html'
        })
        .when('/users/reset', {
            controller: 'UsersResetController',
            templateUrl: '/assets/views/users/users-reset.html'
        })
        .when('/users/password/success', {
            controller: function ($rootScope) {
                $rootScope.pageTitle('Reset Password');
            },
            templateUrl: '/assets/views/users/password/users-password-success.html'
        })
        .when('/users/reset/:token', {
            controller: 'UsersPasswordController',
            templateUrl: '/assets/views/users/users-password.html'
        })

        .when('/user/new', {
            controller: 'FormUserCtrl',
            templateUrl: '/assets/views/forms/user-form.html',
            resolve: {
                mode: function () { return 'create'; }
            }
        })
        .when('/users/:username', {
            controller: 'UsersProfileController',
            templateUrl: '/assets/views/users/users-profile.html'
        })
        .when('/users/:username/edit', {
            controller: 'UsersEditController',
            templateUrl: '/assets/views/users/users-edit.html',
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

.run(function ($rootScope, $window, $anchorScroll, $location, Api) {
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
    $rootScope.getCurrentUser = function () {
        var promise = Api.getCurrentUser(true);
        promise.then(function (user) {
            console.log('Current user', user);
            $rootScope.user = user;
        });
        return promise;
    };
    $rootScope.getCurrentUser();
    $rootScope.$on('$locationChangeStart', function (evt, next, current) {
        $rootScope.toggleNav();
        $rootScope.pageTitle('');
    });
    // Set slideout nav width to sit just outside container
    // min-width is set in css
    $rootScope.navStyle = function () {
        var width = ($window.innerWidth - 1170) / 2;
        return {
            width: width + 'px'
        };
    };
    // Scroll to top
    $rootScope.scrollTop = function () {
       // $location.hash('top');
        $anchorScroll();
    };
});
