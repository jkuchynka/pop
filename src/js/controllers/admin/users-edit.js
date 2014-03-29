angular.module('app')

.controller('AdminUsersEditCtrl', function ($location, $scope, $http, $timeout, $upload, growl, user, roles, Api) {

  $scope.user = user.data;
  $scope.origUser = {};
  angular.extend($scope.origUser, user.data);

  $scope.roles = [];
  angular.forEach(roles, function (val) {
    $scope.roles.push({
      id: val.id,
      name: val.name
    });
  });

  $scope.upload = [];
  $scope.fileUploadObj = {};

  $scope.delete = function () {
    Api.Users.delete({
      id: $scope.user.id
    }, function () {
      $location.path('/admin/users');
      growl.addSuccessMessage('User ' + $scope.user.username + ' deleted.');
    });
  };

  $scope.update = function () {
    Api.Users.update($scope.user, function (user) {
      $location.path('/admin/users');
      growl.addSuccessMessage('User ' + user.username + ' updated.');
    });
  };

  $scope.onFileSelect = function ($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var $file = $files[i];
      (function (index) {
        $scope.upload[index] = $upload.upload({
          url: "/api/users/image/" + $scope.user.id,
          method: "POST",
          data: { fileUploadObj: $scope.fileUploadObj },
          file: $file
        }).progress(function (evt) {
          // get upload percentage
          console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function (data, status, headers, config) {
          // file is uploaded successfully
          console.log(data);
          $scope.user.image = data;
        }).error(function (data, status, headers, config) {
          // file failed to upload
          console.log(data);
        });
      })(i);
    }
  };

  $scope.abortUpload = function (index) {
    $scope.upload[index].abort();
  };

  $scope.removeImage = function () {
    $scope.user.image = null;
  };

});
