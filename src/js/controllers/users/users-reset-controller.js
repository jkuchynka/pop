angular.module('app')

.controller('UsersResetController', function ($scope, $location, $rootScope, growl, Api) {

    $rootScope.pageTitle('Reset Password');

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
