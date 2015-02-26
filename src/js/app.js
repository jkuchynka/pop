
var app = angular.module('app', [
    'ngAnimate', 'ngSanitize', 'ngTable', 'angular-growl',
    'checklist-model', 'angularFileUpload', 'restangular', 'ui.bootstrap', 'ui.select',
    'FormErrors', 'ui.router', 'angular-storage'
]);

app.config(function (growlProvider, RestangularProvider, $locationProvider, $httpProvider, uiSelectConfig) {
    growlProvider.globalTimeToLive(5000);
    growlProvider.onlyUniqueMessages(false);
    growlProvider.globalEnableHtml(true);

    RestangularProvider.setBaseUrl('/api');

    $locationProvider.html5Mode(true);

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
    uiSelectConfig.theme = 'bootstrap';
});

app.run(function ($rootScope, $window, $anchorScroll, $location, $state, growl, store, Restangular, App) {
    $rootScope.showNav = false;
    $rootScope.title = '';

    // Slideout a main menu
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

    // Allow the server to directly set messages
    Restangular.setResponseInterceptor(function (response) {
        if (response.message) {
            growl.addSuccessMessage(response.message);
        }
        return response;
    });

    // Handle error responses
    Restangular.setErrorInterceptor(function (response) {
        if (response.errors) {
            growl.addErrorMessage(response.errors[0]);
        }
        return response;
    });

    // Update storage with current user from server
    $rootScope.user = store.get('user');
    if ($rootScope.user && $rootScope.user.id) {
        // If there's a mismatch between server and app,
        // logout on server and app and refresh
        // If user leaves their browser open for a long time
        // and their server session expires, 401 responses
        // from the server should be caught by the app and
        // then call logout
        Restangular.one('auth/current').get({ 'with[]': ['roles.perms', 'image'] }).then(function (user) {
            console.log('current user from server', user);
            if ($rootScope.user.id && user.id && ($rootScope.user.id == user.id)) {
                //$rootScope.setUser(user);
            } else {
                $rootScope.doLogout();
            }
        });
    }

    $rootScope.setUser = function (user) {
        user.date_created_at = App.parseDate(user.created_at);
        user.date_updated_at = App.parseDate(user.updated_at);
        user.isAdmin = App.userIsAdmin(user);
        store.set('user', user);
        $rootScope.user = user;
        $rootScope.$emit('userSet', {user: user});
    };

    // Logout user from app and server
    $rootScope.doLogout = function (user) {
        store.remove('user');
        // This should be a server route which also handles redirect
        $location.path('/logout');
    };

    $rootScope.$on('$stateChangeStart', function (event, toState) {
        // Hide navs
        $rootScope.toggleNav();

        // Clear and set page title
        $rootScope.title = '';
        if (toState.title) {
            $rootScope.title = toState.title;
        }

        // Check user is authorized to use this route
        if (toState.auth) {
            if (angular.isDefined(toState.auth.authed)) {
                if ((toState.auth.authed && !App.userIsAuthed()) ||
                    (!toState.auth.authed && App.userIsAuthed())) {
                    growl.addErrorMessage("You are not allowed to visit that page.");
                    $state.go('home');
                    event.preventDefault();
                }
            }
        }
    });

    $rootScope.bodyClass = function () {
        var classes = [];
        if ($rootScope.showNav) {
            classes.push('show-' + $rootScope.showNav + '-nav');
        }
        return classes;
    };

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
