angular.module('app')

.factory('RoleService', function ($http, Flash) {
    return {
        query: function () {
            return $http.get('/api/role');
        }
    };
});
