angular.module('app')

.controller('AdminUsersCtrl', function ($scope, $filter, Api, ngTableParams) {

  $scope.initialized = false;

  $scope.title = 'Administer Users';

  $scope.users = [];
  $scope.tableUsers = [];

  $scope.checkboxes = {
    checked: false,
    items: {}
  };

  $scope.getTableData = function ($defer, params) {
    // Use builtin angular filter
    var data = params.sorting ?
      $filter('orderBy')($scope.users, params.orderBy()) :
      $scope.roles;

    data = params.filter ?
      $filter('filter')(data, params.filter()) :
      data;

    $scope.tableUsers = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
      
    // Reset total
    params.total(data.length);
    $defer.resolve($scope.tableUsers);
  };

  $scope.table = new ngTableParams({
    page: 1,
    count: 20,
    defaultSort: 'asc',
    sorting: {
      id: 'asc'
    },
    filter: {
      username: '',
      email: ''
    }
  }, {
    filterEmptyTitle: 'All',
    total: $scope.users.length,
    getData: function ($defer, params) {
      if ( ! $scope.initialized) {
        $scope.initialized = true;
        Api.Users.getList({ 'with[]': ['image', 'roles'] }).then(function (users) {
          $scope.users = users;
          $scope.getTableData($defer, params);
        });
      } else {
        $scope.getTableData($defer, params);
      }
    }
  });
  // Watch for check all checkbox
  $scope.$watch('checkboxes.checked', function (value) {
    angular.forEach($scope.tableUsers, function (item) {
      if (angular.isDefined(item.id)) {
        $scope.checkboxes.items[item.id] = value;
      }
    });
  });
  // Watch for data checkboxes
  $scope.$watch('checkboxes.items', function (values) {
    if (!$scope.users) {
      return;
    }
    var checked = 0, unchecked = 0,
        total = $scope.users.length;
    angular.forEach($scope.users, function (item) {
      checked   +=  ($scope.checkboxes.items[item.id]) || 0;
      unchecked += (!$scope.checkboxes.items[item.id]) || 0;
    });
    if ((unchecked == 0) || (checked == 0)) {
      $scope.checkboxes.checked = (checked == total);
    }
    // grayed checkbox
    angular.element(document.getElementById("select_all")).prop("indeterminate", (checked != 0 && unchecked != 0));
  }, true);
});
