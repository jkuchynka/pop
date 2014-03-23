angular.module('app')

.controller('AdminUsersEditCtrl', function ($location, $scope, growl, user, Api) {

  $scope.user = user.data;
  $scope.origUser = {};
  angular.extend($scope.origUser, user.data);

  $scope.delete = function () {
    Api.Users.delete({
      id: $scope.user.id
    }, function () {
      alert('deleted');
    });
  };

  $scope.update = function () {
    Api.Users.update($scope.user, function (user) {
      $location.path('/admin/users');
      growl.addSuccessMessage('User ' + user.username + ' updated.');
    });
  };

});
