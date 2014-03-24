angular.module('app')

.controller('AdminRolesEditCtrl', function ($location, $scope, growl, role, Api) {

  $scope.role = role;
  $scope.origRole = {};
  angular.extend($scope.origRole, role);

  $scope.delete = function () {
    Api.Roles.delete({
      id: $scope.role.id
    }, function () {
      $location.path('/admin/roles');
      growl.addSuccessMessage('Role ' + $scope.role.name + ' deleted.');
    });
  };

  $scope.update = function () {
    Api.Roles.update($scope.role, function (role) {
      $location.path('/admin/roles');
      growl.addSuccessMessage('Role ' + role.name + ' updated.');
    });
  };

});
