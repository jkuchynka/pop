
app.factory('ModalService', function ($modal, $log, Restangular) {

    var confirm = function ($scope, config) {
        var parentScope = $scope;
        $modal.open({
            templateUrl: '/assets/views/forms/forms-modal-confirm.html',
            controller: function ($scope, $modalInstance) {
                $scope.parentScope = parentScope;
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
        });
    };

    var form = function ($scope, config) {
        var parentScope = $scope;
        $modal.open({
            template: '<div pop-form="form" ng-model="record"></div>',
            controller: function ($scope, $modalInstance) {
                // Reference to parent scope of modal
                $scope.parentScope = parentScope;
                // Whether to show error alert (server or client-side)
                $scope.showErrors = false;
                // Generally, errors that aren't caught by angular form
                $scope.serverErrors = null;
                // Form definition, used by popForm directive
                $scope.form = config.form;
                // Closes the modal
                $scope.doClose = $modalInstance.close;
                // Record to edit, if null, this is an add form
                if (config.record) {
                    // Allow for editing a copy of the record
                    $scope.mode = 'edit';
                    $scope.record = Restangular.copy(config.record);
                } else {
                    $scope.mode = 'add';
                    // Config can specify a default record
                    if (config.defaultRecord) {
                        $scope.record = config.defaultRecord;
                    }
                }
                // If initialization is needed for this form
                if (config.init) {
                    config.init($scope);
                }
                // Called when saving (add/edit) record from form
                $scope.doSave = function () {
                    $scope.showErrors = false;
                    $scope.serverErrors = null;
                    if ($scope.modalform.$valid) {
                        config.doSave($scope);
                    } else {
                        $scope.showErrors = true;
                    }
                };
                $scope.handleErrors = function (response) {
                    if (response.errors) {
                        $scope.showErrors = true;
                        $scope.serverErrors = response.errors;
                        return true;
                    }
                    return false;
                };


            }
        });
    };

    return {
        confirm: confirm,
        form: form
    };

});
