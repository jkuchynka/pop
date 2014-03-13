angular.module('app')

.controller('UserCtrl', function ($scope, $routeParams, UserService) {
  $scope.user = {};
  UserService.getUserByUsername($routeParams.username).success(function (response) {
    $scope.user = response;
  });
});
