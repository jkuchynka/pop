angular.module('app')

.controller('LoginCtrl', function ($scope, $rootScope, $location, AuthService) {
	$rootScope.pageTitle('Login');
 	$scope.login = function () {
    	AuthService.login($scope.user).then(function () {
      		$location.path('/');
    	});
  	};
});
