angular.module('app')

.controller('PagesContactController', function ($scope, $rootScope, Api, growl) {

    $rootScope.pageTitle('Contact Us');

    $scope.showErrors = false;
    $scope.errors = [];

    $scope.submit = function () {
        if ($scope.contactForm.$valid) {
            $scope.showErrors = false;
            Api.Contact.post($scope.contact).then(function (response) {
                $scope.contact = {};
                growl.addSuccessMessage("Thanks for contacting us. We'll be in touch shortly!");
            });
        } else {
            $scope.showErrors = true;
        }
    };
});
