
app.controller('ComponentsCtrl', function ($scope, $rootScope, growl) {

    $rootScope.title = 'Components';

    $scope.roles = [
        { id: 1, label: 'Administrator', key: 'admin' },
        { id: 2, label: 'Editor', key: 'editor' },
        { id: 3, label: 'Writer', key: 'writer' },
        { id: 4, label: 'Approver', key: 'approver' }
    ];

    $scope.user = {
        roles: [ $scope.roles[3] ]
    };

    $scope.growl = {
        type: 'success',
        timeout: null,
        message: 'This is a <b>growl</b> <i>message</i>',
        doGrowl: function () {
            var config = {};
            if ($scope.growl.timeout !== null) {
                config.ttl = parseInt($scope.growl.timeout);
            }
            var message = $scope.growl.message;
            switch ($scope.growl.type) {
                case 'success':
                    growl.success(message, config);
                break;
                case 'info':
                    growl.info(message, config);
                break;
                case 'warn':
                    growl.warning(message, config);
                break;
                case 'error':
                    growl.error(message, config);
                break;
            }
        }
    };

});
