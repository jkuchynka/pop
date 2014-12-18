angular.module('app')

.factory('Api', function (Restangular, $q) {

    var auth = Restangular.all('auth');

    var contact = Restangular.all('contact');

    var forgot = Restangular.all('users/forgot');

    var permissions = Restangular.all('permissions');

    var roles = Restangular.all('roles');

    var users = Restangular.all('users');

    var currUserDefer = null;
    var currentUser = function (refresh) {
        console.log('Api currentUser');
        // Subsequent calls to this should result in
        // 1 server call
        if ( ! currUserDefer || refresh) {
            currUserDefer = $q.defer();

            auth.get('current', { 'with[]': ['roles.perms']}).then(function (user) {
                currUserDefer.resolve(user);
            });
        }

        return currUserDefer.promise;
    };

    return {
        Auth: auth,
        Forgot: forgot,
        Users: users,
        Roles: roles,
        Contact: contact,
        Permissions: permissions,
        getCurrentUser: currentUser
    };
});
