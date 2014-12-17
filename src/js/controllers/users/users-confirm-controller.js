angular.module('app')

.controller('UsersConfirmController', function ($scope, $location, $rootScope, $routeParams, growl, Api) {

    Api.getCurrentUser(true).then(function (user) {
        if (user.id) {
            // trying to confirm account when already logged in
            $location.path('/');
        }
        Api.Users.customPUT({ code: $routeParams.confirmcode }, 'confirm').then(function (user) {
            // User is successfully confirmed, and should be logged in
            // They should have set their password on register page
            // Set the current user and redirect
            $rootScope.getCurrentUser().then(function (user) {
                growl.addSuccessMessage("Your account has been confirmed. Welcome to Pop!");
                $location.path('/');
            });
        }, function (response) {
            $location.path('/users/reset/invalid');
        });
    });

});
