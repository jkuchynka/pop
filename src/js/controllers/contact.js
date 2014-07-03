angular.module('app')

.controller('ContactCtrl', function ($scope, Api, growl) {
  $scope.contact = {};

  $scope.submit = function () {
    Api.Contact.post($scope.contact)
      .then(function (response) {
        $scope.contact = {};
        growl.addSuccessMessage("Thanks for contacting us. We'll be in touch shortly!");
      });
  };
});