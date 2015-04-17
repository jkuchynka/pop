
var AdminUsersCtrl = function ($scope, $rootScope, $log, growl, App, ModalService, Api, store) {

    $scope.refresh = function () {
        $scope.data = null;
        $scope.ngTable.reload();
    };

    // Setup users table
    App.ngTable($scope, {
        sorting: {
            id: 'asc'
        },
        getData: function ($defer, params) {
            Api.all('users').getList({ 'with[]': ['roles', 'image'] }).then(function (users) {
                $scope.data = users;
                $scope.resolveData($defer, params);
            });
        }
    });

    // User create / edit form
    // This is a heavily commented example of how to use
    // both the ModalService and popForm directive to use a form
    // for users that handles both add and edit, with a minimal
    // amount of code.
    //
    // Currently, there are a lot of assumptions made with the form
    // which is good for consistency, but needs more configurable options
    $scope.doUserForm = function (user) {
        if (user) {
            $log.log('edit user', user.plain());
        }
        // Set a reference to current scope that can be
        // used inside the modal
        var parentScope = $scope;
        // Popup a modal form for editing or adding user
        // No specific templates needed, uses popForm directive
        ModalService.form($scope, {
            record: user,
            form: {
                // Initialize
                init: function ($scope) {
                    $scope.roles = [];
                    // Get roles
                    Api.all('roles').getList().then(function (roles) {
                        $scope.roles = roles;
                    });
                },
                // Sets title for Edit User / Add User
                recordLabel: 'User',
                // Api endpoint, POST /api/users or PUT /api/users
                endpoint: 'users',
                // Elements template, wrapped by form
                templateUrl: '/assets/views/users/users-form.html',
                // @todo: Add ability to modify buttons (text/classes, etc...)
                buttons: [

                ],
                // Success callback, popForm should popup a message with growl
                // so just update users data and reload ngTable
                // Errors should be handled and displayed in the form
                success: function ($scope) {
                    // If user updated themselves, update rootscope user
                    var user = store.get('user');
                    if (user.id == $scope.record.id) {
                        $rootScope.setUser($scope.record);
                    }
                    parentScope.refresh();
                    $scope.doClose();
                }
            }
        });
    };

    // User delete confirmation
    $scope.doDeleteUser = function (user) {
        ModalService.confirm($scope, {
            title: 'Delete user: ' + user.username + ' ?',
            doConfirm: function ($scope) {
                user.remove().then(function (response) {
                    growl.addSuccessMessage('User ' + user.username + ' deleted.');
                    $scope.parentScope.refresh();
                    $scope.doClose();
                }, $scope.handleErrors);
            }
        });
    };

};
app.controller('AdminUsersCtrl', AdminUsersCtrl);

app.controller('AdminUsersPermissionsCtrl', function ($scope, $rootScope, $filter, $modal, Api, growl, ngTableParams) {

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

app.controller('AdminUsersRolesCtrl', function ($filter, $scope, $rootScope, ngTableParams, Api) {

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
