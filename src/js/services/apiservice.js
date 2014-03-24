angular.module('app')

.factory('Api', function ($resource) {
  return {
    Users: $resource('/api/users/:id', {id: '@id'}, {
      update: {method: 'PUT'}
    }),
    Roles: $resource('/api/roles/:id', {id: '@id'}, {
      update: {method: 'PUT'}
    })
  };
});
