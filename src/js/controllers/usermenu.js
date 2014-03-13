angular.module('app')

.controller('UserMenuCtrl', function ($scope, AuthService) {
  $scope.user = {};
  // When initializing the app or when current user changes (login/logout)
  // Update the user scope
  $scope.$watch(AuthService.getCurrentUser, function () {
    $scope.user = AuthService.getCurrentUser();
  });
  $scope.logout = function () {
    AuthService.logout();
  };
});
