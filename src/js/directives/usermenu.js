angular.module('app')

.directive('userMenu', function (Api, $rootScope) {
    return {
        restrict: 'A',
        templateUrl: '/assets/views/menus/menus-usermenu.html',
        scope: true,
        link: function (scope, element, attrs) {
            // When initializing the app or when current user changes (login/logout)
            // Update the user scope
            //scope.user = $rootScope.user;
            scope.isAdmin = false;
            /*
            scope.$watch(Api.getCurrentUser, function () {
                scope.user = Api.getCurrentUser();
                //scope.isAdmin = Api.userCanAccess('admin');
            });
*/
        }
    };
});
