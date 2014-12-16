angular.module('app')

.controller('PagesContactController', function ($scope, $rootScope, Api, growl) {
  	$scope.contact = {};
  	$rootScope.pageTitle('Contact Us');

  	$scope.submit = function () {
    	Api.Contact.post($scope.contact)
      		.then(function (response) {
        		$scope.contact = {};
        		growl.addSuccessMessage("Thanks for contacting us. We'll be in touch shortly!");
      	});
  	};
});
