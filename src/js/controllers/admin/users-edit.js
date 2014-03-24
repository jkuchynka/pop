angular.module('app')

.controller('AdminUsersEditCtrl', function ($location, $scope, growl, user, roles, Api) {

  $scope.user = user.data;
  $scope.origUser = {};
  angular.extend($scope.origUser, user.data);
  $scope.roles = [];
  angular.forEach(roles, function (val) {
    $scope.roles.push({
      id: val.id,
      name: val.name
    });
  });

  $scope.delete = function () {
    Api.Users.delete({
      id: $scope.user.id
    }, function () {
      $location.path('/admin/users');
      growl.addSuccessMessage('User ' + $scope.user.username + ' deleted.');
    });
  };

  $scope.update = function () {
    Api.Users.update($scope.user, function (user) {
      $location.path('/admin/users');
      growl.addSuccessMessage('User ' + user.username + ' updated.');
    });
  };

});
