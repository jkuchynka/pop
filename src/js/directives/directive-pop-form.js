
app.directive('popForm', function ($sce) {
    return {
        restrict: 'A',
        scope: {
            config: '=popForm',
            record: '=?ngModel'
        },
        templateUrl: '/assets/views/forms/form-pop.html',
        /*
        template: function (tElem, tAttrs) {

            //return '<div ng-click="doShowForm()"></div>';
        },*/
        link: function(scope, elem, attr, controller) {
            // Setup config, override default
            scope.config = _.extend({
                modal: false,
                elements: [],
                buttons: {
                    save: 'Save'
                }
            }, scope.config);
            // Setup form elements
            scope.elements = scope.config.elements;
            _.each(scope.elements, function (element) {
                if (element.html) {
               //     element.html = $sce.trustAsHtml(element.html);
                }
            });
            // Are we editing or adding a record?
            if (!scope.record) {
                scope.mode = 'add';
                scope.record = {};
            } else {
                scope.mode = 'edit';
            }
            if (scope.config.init) {
                scope.config.init(scope);
            }
        },
        controller: function ($scope, $log, $sce, Api, growl) {
            $log.log('popForm controller scope', $scope);
            $scope.showErrors = false;
            $scope.serverErrors = null;
            // If modal, this closes modal
            $scope.doClose = $scope.$parent.doClose;
            $scope.handleErrors = function (response) {
                $scope.showErrors = true;
                $scope.serverErrors = response.data.errors;
            };
            // User attempts to add/edit record
            $scope.doSave = function () {
                $scope.showErrors = false;
                $scope.serverErrors = null;
                if ($scope.popform.$valid) {
                    if ($scope.config.doSave) {
                        $scope.config.doSave($scope);
                    } else {
                        if ($scope.mode == 'edit') {
                            $scope.record.put().then(function (response) {
                                growl.success($scope.config.recordLabel + ' updated.');
                                $scope.config.success($scope);
                            }, $scope.handleErrors);
                        } else {
                            $log.log('posting record', $scope.record);
                            Api.all($scope.config.endpoint).post($scope.record).then(function (response) {
                                if ($scope.config.recordLabel) {
                                    growl.success($scope.config.recordLabel + ' created.');
                                }
                                $scope.config.success($scope, response);
                            }, $scope.handleErrors);
                        }
                    }
                } else {
                    $scope.showErrors = true;
                }
            };

            $log.log('popForm Dir', $scope);
        }
    };
});
