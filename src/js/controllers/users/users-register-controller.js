
angular.module('app')

.controller('UsersRegisterController', function ($scope, $rootScope, growl, Api) {

    $rootScope.pageTitle('Register');

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
