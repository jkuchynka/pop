
app.controller('UsersConfirmCtrl', function ($scope, $location, $rootScope, $routeParams, growl, Api) {

    Api.getCurrentUser(true).then(function (user) {
        if (user.id) {
            // trying to confirm account when already logged in
            $location.path('/');
        }
        Api.Users.customPUT({ code: $routeParams.confirmcode }, 'confirm').then(function (user) {
            // User is successfully confirmed, and should be logged in
            // They should have set their password on register page
            // Set the current user and redirect
            $rootScope.getCurrentUser().then(function (user) {
                growl.addSuccessMessage("Your account has been confirmed. Welcome to Pop!");
                $location.path('/');
            });
        }, function (response) {
            $location.path('/users/reset/invalid');
        });
    });

});

app.controller('UsersEditCtrl', function ($scope, $rootScope, $modal, $state, growl, mode, roles, store, App, Restangular) {

    $scope.errors = [];
    $scope.showErrors = false;

    $scope.roles = roles;
    $scope.user = Restangular.copy(store.get('user'));
    $scope.mode = mode;

    $scope.selectedRoles = [];
    $scope.user.roles = _.pluck($scope.user.roles, 'id');
    if (mode != 'edit') {
        $rootScope.title = 'Add user';
    }

    $scope.doDelete = function () {
        var parentScope = $scope;
        $modal.open({
            template: App.modalTemplate(),
            controller: function ($scope, $modalInstance, $rootScope) {
                var doConfirm = function () {
                    parentScope.user.delete().then(function () {
                        growl.addSuccessMessage('Your account has been deleted.');
                        $modalInstance.close();
                        $rootScope.doLogout();
                    });
                };
                $scope.title = 'Delete Account?';
                $scope.message = 'Are you sure you want to delete your account?';
                $scope.buttons = [
                    { label: 'Cancel', click: $modalInstance.close, class: 'btn-warning pull-left' },
                    { label: 'Yes', click: doConfirm, class: 'btn-danger pull-right' }
                ];
            }
        });
    };

    $scope.doSubmit = function () {
        $scope.showErrors = false;
        if (!$scope.userForm.$valid) {
            $scope.showErrors = true;
            return;
        }
        if ($scope.mode == 'edit') {
            //$scope.user.roles = $scope.selectedRoles;
            $scope.user.put().then(function (response) {
                // Update rootScope user
                $rootScope.setUser(response);
                growl.addSuccessMessage('Success! Your profile has been updated.');
                $state.go('profile');
            }, function (response) {
                $scope.errors = response.data.errors;
                $scope.showErrors = true;
            });
        }
        if ($scope.mode == 'create') {
            $scope.user.roles = $scope.selectedRoles;
            Restangular.all('users').post($scope.user).then(function (user) {
                growl.addSuccessMessage('Success! User ' + user.username + ' created.');
                $state.go('profile');
            }, function (response) {
                $scope.errors = response.data.errors;
                $scope.showErrors = true;
            });
        }
    };

});

app.controller('UsersLoginCtrl', function ($scope, $rootScope, $location, $state, Api, growl, store, Restangular) {

    $scope.errors = [];
    $scope.showErrors = false;

    $scope.user = {};

    $scope.submit = function () {
        $scope.showErrors = false;
        if ($scope.loginForm.$valid) {
            Api.Auth.post($scope.user).then(function (user) {
                // Load up all user info
                Restangular.one('users', user.id).get({'with[]': ['roles', 'image']}).then(function (user) {
                    growl.addSuccessMessage('Welcome back, ' + user.username + ' !');
                    $rootScope.setUser(user);
                    $state.go('profile');
                });
            }, function (response) {
                $scope.errors = response.data.errors;
                $scope.showErrors = true;
            });
        } else {
            $scope.showErrors = true;
        }
    };

});

app.controller('UsersPasswordCtrl', function ($scope, $location, $routeParams, $rootScope, growl, Api) {

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

});

app.controller('UsersProfileCtrl', function ($scope, $rootScope, store, user) {
    //$scope.user = store.get('user');
    $scope.user = user;
    console.log(user);
    $rootScope.title = $scope.user.username + "'s Profile";
});


app.controller('UsersRegisterCtrl', function ($scope, $rootScope, growl, Api) {

    $scope.showErrors = false;
    $scope.errors = [];

    $scope.mode = 'init';

    $scope.user = {};

    $scope.errorMessages = {
        validAvailable: 'is already taken.',
        pattern: 'must be at least 7 characters long and contain at least one capitalized letter.',
        validEquals: "doesn't match New Password."
    };

    $scope.submit = function () {
        if ($scope.registerForm.$valid) {
            $scope.showErrors = false;
            Api.Users.post($scope.user).then(function (user) {
                $scope.mode = 'success';
            }, function (response) {
                $scope.showErrors = true;
                $scope.errors[0] = response.data.errors[0];
            });
        } else {
            $scope.showErrors = true;
        }
    };

});

app.controller('UsersResetCtrl', function ($scope, $location, $rootScope, growl, Api) {

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

});

app.controller('UsersResetInvalidCtrl', function ($scope, $rootScope) {
    //$rootScope.pageTitle('Reset Password');
});

app.controller('UsersResetSuccessCtrl', function ($scope, $rootScope) {
    //$rootScope.pageTitle('Reset Password');
});

