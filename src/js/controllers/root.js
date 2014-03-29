angular.module('app')

.controller('RootCtrl', function ($scope) {
  $scope.showLeftNav = false;
  $scope.showRightNav = false;
  $scope.toggleNav = function (pos) {
    if (pos == 'right') {
      $scope.showRightNav = ! $scope.showRightNav;
    } else {
      $scope.showLeftNav = ! $scope.showLeftNav;
    }
  };
  $scope.navClass = function () {
    var classes = '';
    if ($scope.showLeftNav) {
      classes += 'show-left-nav ';
    }
    if ($scope.showRightNav) {
      classes += 'show-right-nav ';
    }
    return classes;
  };

});
