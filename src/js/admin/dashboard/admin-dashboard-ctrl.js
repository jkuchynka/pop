
app.controller('AdminDashboardCtrl', function ($scope, $log) {
    $log.log('AdminDashboardCtrl');

    $scope.modules = [
        { sref: 'admin.users', label: 'Users' }
    ];
});
