angular.module('app')

.controller('AdminRolesCtrl', function ($filter, $scope, $rootScope, ngTableParams, Api) {

    $scope.initialized = false;

    $rootScope.pageTitle('Administer Roles');

    $scope.roles = [];
    $scope.filteredRoles = [];

    $scope.checkboxes = {
        checked: false,
        items: {}
    };

    $scope.filterTableData = function ($defer, params) {
        // Use builtin angular filter
        var data = params.sorting ?
            $filter('orderBy')($scope.roles, params.orderBy()) :
            $scope.roles;

        data = params.filter ?
            $filter('filter')(data, params.filter()) :
            data;

        $scope.filteredRoles = data.slice((params.page() - 1) * params.count(), params.page() * params.count());

        // Reset total
        params.total(data.length);
        $defer.resolve($scope.filteredRoles);
    };

    $scope.table = new ngTableParams({
        page: 1,
        count: 20,
        defaultSort: 'asc',
        sorting: {
            id: 'asc'
        },
        filter: {
            name: ''
        }
    }, {
        counts: [], // Hide page counts control
        filterEmptyTitle: 'All',
        total: $scope.roles.length,
        getData: function ($defer, params) {
            if ( ! $scope.initialized) {
                $scope.initialized = true;
                Api.Roles.getList().then(function (roles) {
                    $scope.roles = roles;
                    $scope.filterTableData($defer, params);
                });
            } else {
                $scope.filterTableData($defer, params);
            }
        }
    });
});
