angular.module('app')

.controller('AdminPermissionsCtrl', function ($scope, $rootScope, $filter, $modal, Api, growl, ngTableParams) {

    $scope.initialized = false;

    $rootScope.pageTitle('Administer Permissions');

    $scope.permissions = [];
    $scope.tablePermissions = [];
    $scope.columns = 3;

    $scope.checkboxes = {
        checked: false,
        items: {}
    };

    $scope.getTableData = function ($defer, params) {
        // Use builtin angular filter
        var data = params.sorting ?
            $filter('orderBy')($scope.permissions, params.orderBy()) :
            $scope.permissions;

        data = params.filter ?
            $filter('filter')(data, params.filter()) :
            data;

        $scope.tablePermissions = data.slice((params.page() - 1) * params.count(), params.page() * params.count());

        // Reset total
        params.total(data.length);
        $defer.resolve($scope.tablePermissions);
    };

    $scope.table = new ngTableParams({
        page: 1,
        count: 999,
        defaultSort: 'asc',
        sorting: {
            name: 'asc'
        },
        filter: {
            name: ''
        }
    }, {
        counts: [],
        filterEmptyTitle: 'All',
        groupBy: 'model',
        total: 1,
        getData: function ($defer, params) {
            if ( ! $scope.initialized) {
                $scope.initialized = true;
                Api.Permissions.getList({ with: 'roles' }).then(function (permissions) {
                    _.each(permissions, function (permission) {
                        var parts = permission.name.split('_');
                        permission.selectedRoles = [];
                        _.each(permission.roles, function (role) {
                            permission.selectedRoles[role] = role;
                        });
                    });
                    Api.Roles.getList({}).then(function (roles) {
                        $scope.columns += roles.length;
                        $scope.permissions = permissions;
                        $scope.roles = roles;
                        $scope.getTableData($defer, params);
                    });
                });
            } else {
                $scope.getTableData($defer, params);
            }
        }
    });

});
