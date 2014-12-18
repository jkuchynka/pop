angular.module('app')

.controller('UsersProfileController', function ($scope, $rootScope, $routeParams, growl, Api) {
  	$scope.user = {};

    Api.Users.getList({ 'where[]': 'username,' + $routeParams.username, 'with[]': ['image', 'roles'] }).then(function (users) {
    	if (users[0]) {
      		$scope.user = users[0];
      		$rootScope.pageTitle($scope.user.username);
    	} else {
      		growl.addErrorMessage("User not found");
    	}
  	});

});
