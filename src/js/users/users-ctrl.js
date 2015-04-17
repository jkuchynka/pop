
var ConfirmCtrl = function ($scope, $location, $rootScope, $stateParams, growl, Api, user) {
    if (user && user.id) {
        // trying to confirm account when already logged in
        $location.path('/');
        return;
    }
    Api.all('users').customPUT({ code: $stateParams.confirmcode }, 'confirm').then(function (user) {
        // User is successfully confirmed, and should be logged in
        // They should have set their password on register page
        // Set the current user and redirect
        Api.one('users', user.id).get({ 'with[]': ['roles', 'image'] }).then(function (user) {
            $rootScope.setUser(user);
            growl.addSuccessMessage("Your account has been confirmed. Welcome to Pop!");
            $location.path('/');
        });
    }, function (response) {
        $state.go('users.reset.invalid');
    });

};
app.controller('UsersConfirmCtrl', ConfirmCtrl);

var LoginCtrl = function ($scope, $rootScope, $log, $state, Api, growl) {

    $scope.form = {
        title: 'Login',
        endpoint: 'auth',
        templateUrl: '/assets/views/users/users-login-form.html',
        buttons: { save: 'Login' },
        success: function ($formScope, response) {
            Api.one('users', response.id).get({ 'with[]': ['roles', 'image'] }).then(function (user) {
                $rootScope.setUser(user);
                growl.addSuccessMessage('Welcome back, ' + user.username + ' !');
                $state.go('users.profile');
            });
        }
    };

};
app.controller('UsersLoginCtrl', LoginCtrl);

var PasswordCtrl = function ($scope, $location, $routeParams, $rootScope, growl, Api) {

    $scope.reset = {};

    $scope.showErrors = false;
    $scope.errors = [];

    $scope.errorMessages = {
        pattern: 'must be at least 7 characters long and contain at least one capitalized letter.',
        validEquals: "doesn't match New Password."
    };

    Api.getCurrentUser(true).then(function (user) {
        if (user.id) {
            // trying to access reset when already logged in
            $location.path('/');
        }
        Api.Users.customGET('reset/token', { token: $routeParams.token }).then(function () {
            $scope.reset.token = $routeParams.token;
        }, function (response) {
            $location.path('/users/reset/invalid');
        });
    });

    $scope.submitPassword = function () {
        $scope.showErrors = false;
        if ($scope.passwordForm.$valid) {
            Api.Users.customPOST($scope.reset, 'reset').then(function (response) {
                $location.path('/users/reset/success');
            }, function (response) {
                $scope.errors = response.data.errors;
                $scope.showErrors = true;
            });
        } else {
            $scope.showErrors = true;
        }
    };

};
app.controller('UsersPasswordCtrl', PasswordCtrl);

var ProfileCtrl = function ($scope, $rootScope, Api, ModalService, user) {
    $scope.user = user;
    $scope.setTitle = function () {
        $rootScope.title = $scope.user.username + "'s Profile";
    };
    $scope.setTitle();
    $scope.refresh = function () {
        Api.one('auth/current').get({ 'with[]': ['roles.perms', 'image'] }).then(function (user) {
            user.route = 'users';
            $rootScope.setUser(user);
            $scope.user = user;
            $scope.setTitle();
        });
    };
    $scope.doEditProfile = function () {
        ModalService.form($scope, {
            record: $scope.user,
            form: {
                recordLabel: 'Profile',
                endpoint: 'users',
                templateUrl: '/assets/views/users/users-form.html',
                success: function ($modalScope) {
                    $scope.refresh();
                    $modalScope.doClose();
                }
            }
        });
    };
};
app.controller('UsersProfileCtrl', ProfileCtrl);

var RegisterCtrl = function ($scope) {
    $scope.display = 'init';
    $scope.form = {
        title: 'Register',
        recordLabel: 'User',
        endpoint: 'users',
        templateUrl: '/assets/views/users/users-register-form.html',
        success: function ($formScope) {
            $scope.display = 'success';
        }
    };
};
app.controller('UsersRegisterCtrl', RegisterCtrl);

var ResetCtrl = function ($scope, $location, $rootScope, growl, Api) {

    $scope.showErrors = false;
    $scope.errors = [];

    $scope.errorMessages = [];

    $scope.submit = function () {
        if ($scope.resetForm.$invalid) {
            $scope.showErrors = true;
        } else {
            Api.Forgot.post($scope.reset).then(function (response) {
                $location.path('/users/reset/success');
            }, function (response) {
                $scope.errors = response.data.errors;
                $scope.showErrors = true;
            });
        }
    };

};
app.controller('UsersResetCtrl', ResetCtrl);

var ResetInvalidCtrl = function ($scope, $rootScope) {

};
app.controller('UsersResetInvalidCtrl', ResetInvalidCtrl);

var ResetSuccessCtrl = function ($scope, $rootScope) {

};
app.controller('UsersResetSuccessCtrl', ResetSuccessCtrl);
