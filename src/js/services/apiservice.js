angular.module('app')

.factory('Api', function ($resource, Restangular) {

  var contact = Restangular.all('contact');

  var roles = Restangular.all('roles');

  var users = Restangular.all('users');

  return {
    Users: users,
    Roles: roles,
    Contact: contact
  };
});
