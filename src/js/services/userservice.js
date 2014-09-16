angular.module('app')

.factory('UserService', function ($http, Flash) {
    return {
        get: function (id) {
            return $http.get('/api/users/' + id);
        },
        query: function () {
            return $http.get('/api/users');
        },
        getUserByUsername: function (name) {
            var user = $http.get('/api/users/' + name);
            return user;
        },
        delete: function (id) {
            return $http.delete('/api/users/' + id);
        }
    };
});
