angular.module('app')

.controller('UsersConfirmController', function ($scope, $location, $rootScope, $routeParams, Api, mode) {

    $scope.mode = 'init';
    $scope.user = {};

    $scope.errors = [];
    $scope.showErrors = false;

    $scope.errorMessages = {
        pattern: 'must be at least 7 characters long and contain at least one capitalized letter.',
        validEquals: "doesn't match New Password."
    };

    if (mode == 'confirm') {
        Api.getCurrentUser(true).then(function (user) {
            if (user.id) {
                // trying to confirm account when already logged in
                $location.path('/');
            }
            $rootScope.pageTitle('Confirm Account');
            Api.Users.customPUT({ code: $routeParams.confirmcode }, 'confirm').then(function (user) {
                $scope.user = user;
            }, function (response) {
                $scope.mode = 'expired';
            });
        });
    } else if (mode == 'reset') {
        $scope.user.token = $routeParams.resetcode;
    }

    $scope.submitPassword = function () {
        $scope.showErrors = false;
        if ($scope.passwordForm.$valid) {
            if (mode == 'confirm') {
                Api.Users.customPUT($scope.user, $scope.user.id).then(function (user) {
                    $scope.mode = 'success';
                }, function (response) {
                    $scope.errors = response.data.errors;
                    $scope.showErrors = true;
                });
            } else if (mode == 'reset') {
                Api.Reset.post($scope.user).then(function (response) {
                    $scope.mode = 'success';
                }, function (response) {
                    $scope.errors = response.data.errors;
                    $scope.showErrors = true;
                });
            }
        } else {
            $scope.showErrors = true;
        }
    };

});
