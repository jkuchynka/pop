
app.factory('App', function ($filter, $location, $upload, store, ngTableParams, Restangular) {

    var getHost = function () {
        var hostname = $location.protocol() + '://' + $location.host();
        var port = $location.port();
        if (port && port != '80') {
            hostname += ':' + port;
        }
        return hostname;
    };

    var modalTemplate = function () {
        return '<div class="modal-header"><h3 ng-bind="title"></h3></div><div class="modal-body"><p ng-bind="message"></p></div><div class="modal-footer"><button ng-repeat="btn in buttons" ng-bind="btn.label" class="btn" ng-class="btn.class" ng-click="btn.click()"></button></div>';
    };

    var ngTable = function ($scope, config) {

        //$scope.data = Restangular.copy($data);

        $scope.resolveData = function ($defer, params) {
            var data = params.sorting ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
            data = params.filter ? $filter('filter')(data, params.filter()) : data;
            data = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
            params.total(data.length);
            $defer.resolve(data);
        };

        config = config ? config : {};

        // Default params
        var params = {
            page: 1,
            count: 10, //$data.length,
            defaultSort: 'asc',
            sorting: {
                id: 'asc'
            },
            filter: {}
        };

        // Params override with config
        _.each(params, function (val, key) {
            if (angular.isDefined(config[key])) {
                params[key] = config[key];
            }
        });

        // Initialize ngTable
        $scope.ngTable = new ngTableParams(params, {
            filterEmptyTitle: 'All',
            total: 0,
            getData: function ($defer, params) {
                if ( ! $scope.data) {
                    config.getData($defer, params);
                } else {
                    $scope.resolveData($defer, params);
                }
            }
        });

        // Watch for check all checkbox
        $scope.$watch('checkboxes.checked', function (value) {
            if (!$scope.data) {
                return;
            }
            angular.forEach($scope.data, function (item) {
                if (angular.isDefined(item.id)) {
                    $scope.checkboxes.items[item.id] = value;
                }
            });
        });
        $scope.checkboxes = {
            checked: false,
            items: {}
        };
        // Watch for data checkboxes
        $scope.$watch('checkboxes.items', function (values) {
            if (!$scope.data) {
                return;
            }
            var checked = 0, unchecked = 0,
                //total = $scope.users.length;
                total = $scope.data.length;
            angular.forEach($data, function (item) {
                checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                unchecked += (!$scope.checkboxes.items[item.id]) || 0;
            });
            if ((unchecked === 0) || (checked === 0)) {
                $scope.checkboxes.checked = (checked == total);
            }
            // grayed checkbox
            angular.element(document.getElementById("select_all")).prop("indeterminate", (checked !== 0 && unchecked !== 0));
        }, true);
    };

    var parseDate = function (dateStr) {
        return moment(dateStr, ["YYYY-MM-DD hh:mm:ss"]).valueOf();
    };

    var userIsAdmin = function (user) {
        var ret = false;
        _.each(user.roles, function (role) {
            if (role.name == 'admin') {
                ret = true;
            }
        });
        return ret;
    };

    var userIsAuthed = function () {
        var user = store.get('user');
        if (!user || !user.id) {
            return false;
        }
        return user.id > 0;
    };

    return {
        getHost: getHost,
        modalTemplate: modalTemplate,
        ngTable: ngTable,
        parseDate: parseDate,
        userIsAdmin: userIsAdmin,
        userIsAuthed: userIsAuthed
    };

});
