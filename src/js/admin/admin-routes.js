
app.config(function ($stateProvider) {
    $stateProvider
        .state('admin', {
            url: '/admin',
            controller: 'AdminDashboardCtrl',
            templateUrl: '/assets/views/admin/admin-dashboard.html',
            title: 'Admin',
            ncyBreadcrumb: {
                label: 'Admin'
            },
            auth: {
                role: 'admin'
            }
        });
});
