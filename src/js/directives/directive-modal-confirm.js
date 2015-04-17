
app.directive('modalConfirm', function () {

    return {
        restrict: 'A',
        templateUrl: '/assets/views/forms/forms-modal-confirm.html',
        scope: {
            config: '=modalConfirm'
        },
        controller: function ($scope, $modalInstance) {
            $scope.showErrors = false;
            $scope.serverErrors = null;
            $scope.title = config.title;
            $scope.message = config.message;
            $scope.doClose = $modalInstance.close;
            $scope.doConfirm = function () {
                config.doConfirm($scope);
            };
            $scope.responseErrors = function (response) {
                if (response.errors) {
                    $scope.showErrors = true;
                    $scope.serverErrors = response.errors;
                    return true;
                }
                return false;
            };
        }
    };
});
