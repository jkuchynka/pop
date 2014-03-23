angular.module('app')

.factory('Api', function ($resource) {
  return {
    Users: $resource('/api/users/:id', {id: '@id'}, {
      update: {method: 'PUT'}
    })
  };
});
