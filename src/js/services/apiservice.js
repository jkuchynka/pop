angular.module('app')

.factory('Api', function ($resource, Restangular) {

  var contact = Restangular.all('contact');

  return {
    Users: $resource('/api/users/:id', {id: '@id'}, {
      update: {method: 'PUT'}
    }),
    Roles: $resource('/api/roles/:id', {id: '@id'}, {
      update: {method: 'PUT'}
    }),
    Contact: contact
  };
});
