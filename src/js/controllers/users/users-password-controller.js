angular.module('app')

.controller('UsersPasswordController', function ($scope, $location, $routeParams, $rootScope, growl, Api) {

    $rootScope.pageTitle('Set Password');

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
