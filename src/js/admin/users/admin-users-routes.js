
app.config(function ($stateProvider) {
    $stateProvider
        .state('admin.users', {
            url: '/users',
            controller: 'AdminUsersCtrl',
            templateUrl: '/assets/views/admin/users/admin-users.html',
            title: 'Admin Users',
            ncyBreadcrumb: {
                'label': 'Users'
            },
            auth: {
                authed: true
            },
            resolve: {
                users: function (Restangular) {
                    return Restangular.all('users').getList({ 'with[]': ['roles', 'image'] });
                }
            }
        });
});
