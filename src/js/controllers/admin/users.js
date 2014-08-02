angular.module('app')

.controller('AdminUsersCtrl', function ($scope, $filter, $modal, Api, growl, ngTableParams) {

  $scope.initialized = false;

  $scope.title = 'Administer Users';

  $scope.users = [];
  $scope.tableUsers = [];

  $scope.checkboxes = {
    checked: false,
    items: {}
  };

  $scope.deleteUser = function (user) {
    var parentScope = $scope;
    $modal.open({
      templateUrl: 'confirm.html',
      controller: function ($scope, $modalInstance) {

        $scope.message = 'Are you sure you want to delete the user: <i>' + user.username + '</i> ?';
        $scope.okText = 'Delete';
        $scope.cancelText = 'Cancel';

        $scope.ok = function () {
          user.remove().then(function () {
            growl.addSuccessMessage('User ' + user.username + ' deleted');
            parentScope.table.reload();
            $modalInstance.close();
          });
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      }
    })
  };

  $scope.getTableData = function ($defer, params) {
    // Use builtin angular filter
    var data = params.sorting ?
      $filter('orderBy')($scope.users, params.orderBy()) :
      $scope.users;

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
          _.each($scope.users, function (user) {
            user.created_at = new Date(user.created_at);
            user.updated_at = new Date(user.updated_at);
          });
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
