angular.module('app')

.directive('userMenu', function (AuthService) {
  return {
    restrict: 'A',
    templateUrl: '/views/usermenu.html',
    scope: true,
    link: function (scope, element, attrs) {
      // When initializing the app or when current user changes (login/logout)
      // Update the user scope
      scope.user = {};
      scope.isAdmin = false;
      scope.$watch(AuthService.getCurrentUser, function () {
        scope.user = AuthService.getCurrentUser();
        scope.isAdmin = AuthService.userCanAccess('admin');
      });
    }
  };
});
