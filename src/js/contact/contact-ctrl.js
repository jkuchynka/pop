
app.controller('ContactCtrl', function ($scope, $rootScope, Api, growl) {
    $rootScope.title = 'Contact Us';

    $scope.showErrors = false;
    $scope.errors = [];

    $scope.submit = function () {
        if ($scope.contactForm.$valid) {
            $scope.showErrors = false;
            Api.Contact.post($scope.contact).then(function (response) {
                $scope.contact = {};
                growl.success("Thanks for contacting us. We'll be in touch shortly!");
            });
        } else {
            $scope.showErrors = true;
        }
    };
});
