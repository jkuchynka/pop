angular.module('app')

.controller('AdminUsersCtrl', function ($scope, $filter, users, ngTableParams) {
  $scope.title = 'Administer Users';
  $scope.users = [];
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
      username: '',
      email: ''
    }
  }, {
    filterEmptyTitle: 'All',
    total: $scope.users.length,
    getData: function ($defer, params) {
      console.log('getData', params);
      // Use builtin angular filter
      var data = params.sorting ?
        $filter('orderBy')(users.data, params.orderBy()) :
        users.data;

      data = params.filter ?
        $filter('filter')(data, params.filter()) :
        data;

      $scope.users = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
      // Reset total
      params.total(data.length);
      // Set current paged set
      $defer.resolve($scope.users);

    }
  });
  // Watch for check all checkbox
  $scope.$watch('checkboxes.checked', function (value) {
    angular.forEach($scope.users, function (item) {
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
