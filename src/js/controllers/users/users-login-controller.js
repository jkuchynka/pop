angular.module('app')

.controller('UsersLoginController', function ($scope, $rootScope, $location, Api, growl) {

    $rootScope.pageTitle('Login');

    $scope.user = {};

    $scope.errors = [];

    $scope.showErrors = false;

    $scope.submit = function () {
        $scope.showErrors = false;
        if ($scope.loginForm.$valid) {
            Api.Auth.post($scope.user).then(function (user) {
                $rootScope.getCurrentUser();
                growl.addSuccessMessage('Welcome back, ' + user.username + ' !');
                $location.path('/');
            }, function (response) {
                $scope.errors = response.data.errors;
                $scope.showErrors = true;
            });
        } else {
            $scope.showErrors = true;
        }
    };

});
