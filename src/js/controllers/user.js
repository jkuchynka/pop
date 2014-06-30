angular.module('app')

.controller('UserCtrl', function ($scope, $routeParams, growl, Restangular) {
  $scope.user = {};

  Restangular.all('api/users').getList({ 'where[]': 'username,' + $routeParams.username }).then(function (users) {
    if (users[0]) {
      $scope.user = users[0];
    } else {
      growl.addErrorMessage("User not found");
    }
  });

});
