angular.module('app')

.directive('userMenu', function (AuthService) {
  return {
    restrict: 'A',
    templateUrl: '/views/usermenu.html',
    link: function (scope, element, attrs) {
      // When initializing the app or when current user changes (login/logout)
      // Update the user scope
      scope.user = {};
      scope.$watch(AuthService.getCurrentUser, function () {
        scope.user = AuthService.getCurrentUser();
      });
    }
  };
});
