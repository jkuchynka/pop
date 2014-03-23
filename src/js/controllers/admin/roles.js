angular.module('app')

.controller('AdminRolesCtrl', function ($scope, roles) {
  $scope.title = 'Administer Roles';
  $scope.roles = roles;
  $scope.table = new ngTableParams({
    page: 1,
    count: 20,
    defaultSort: 'asc',
    sorting: {
      id: 'asc'
    },
    filter: {
      name: ''
    }
  }, {
    filterEmptyTitle: 'All',
    total: $scope.roles.length,
    getData: function ($defer, params) {
      // Use builtin angular filter
      var data = $scope.roles;
      if (params.filter()) {
        data = $filter('filter')(data, params.filter());
      }
      // Do sorting
      if (params.sorting()) {
        data = $filter('orderBy')(data, params.orderBy());
      }
      // Reset total
      params.total(data.length);
      // Set current paged set
      $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  })
});
