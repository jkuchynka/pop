angular.module('app')

.controller('AdminRolesCtrl', function ($filter, $scope, ngTableParams, roles) {
  console.log('IN ROLES CTRL');
  $scope.title = 'Administer Roles';
  $scope.roles = [];
  $scope.checkboxes = {
    checked: false,
    items: {}
  };
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
      console.log('ROLES GET DATA', roles, roles.$resolved);
      // Use builtin angular filter
      var data = params.sorting ?
        $filter('orderBy')(roles, params.orderBy()) :
        roles;

      data = params.filter ?
        $filter('filter')(data, params.filter()) :
        data;

      $scope.roles = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
      // Reset total
      params.total(data.length);
      // Set current paged set
      $defer.resolve($scope.roles);
    }
  })
});
