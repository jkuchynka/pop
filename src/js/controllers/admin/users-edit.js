angular.module('app')

.controller('AdminUsersEditCtrl', function ($location, $scope, growl, user, roles, Api) {

  $scope.user = user.data;
  $scope.origUser = {};
  angular.extend($scope.origUser, user.data);
  $scope.roles = [];
  roles.$promise.then(function (data) {
    angular.forEach(data, function (val) {
      $scope.roles.push({
        id: val.id,
        name: val.name
      });
    });
  });

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
