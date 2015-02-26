
app.config(function ($stateProvider) {
    var vPath = '/assets/views/';
    $stateProvider.state('admin.users', {
        url: '/admin/users',
        templateUrl: vPath + '/assets/views/admin/users/admin-users.html',
        authenticate: true,
        controller: 'AdminUsersCtrl',
        resolve: {
            users: function (Restangular) {
                return Restangular.all('users').getList();
            }
        }
    });
});
