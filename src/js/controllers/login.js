angular.module('app')

.controller('LoginCtrl', function ($scope, $location, AuthService) {
  $scope.login = function () {
    AuthService.login($scope.user).then(function () {
      $location.path('/');
    });
  };
});
