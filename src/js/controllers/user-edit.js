angular.module('app')

.controller('UserEditCtrl', function ($location, $scope, $http, $modal, $routeParams, $timeout, $upload, growl, AuthService,Restangular) {

  $scope.user = {};
  Restangular
    .one('users', $routeParams.userid)
    .get({ 'with[]': ['image', 'roles'] })
    .then(function (user) {
      $scope.user = user;
      console.log('Editing user', $scope.user);
    })
  ;

  $scope.upload = [];
  $scope.fileUploadObj = {};

  $scope.delete = function () {
    var modal = $modal.open({
      templateUrl: 'modalDeleteAccount',
      controller: 'UserEditModalCtrl'
    });
  };

  $scope.update = function () {
    $scope.user
      .put()
      .then(function (response) {
        growl.addSuccessMessage('Success! Your profile has been updated.');
        AuthService.loadCurrentUser();
        $location.path('/user/' + $scope.user.username);
      }, function (response) {
        growl.addErrorMessage("Error updating profile: " + response.data.errors[0]);
      })
    ;
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
          $scope.user.image = data;
        }).error(function (data, status, headers, config) {
          // file failed to upload
          growl.addErrorMessage("Error uploading image");
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

})
.controller('UserEditModalCtrl', function ($scope, $location, $modal, $modalInstance, growl, Api) {
  $scope.deleteCancel = function () {
    $modalInstance.dismiss();
  };

  $scope.deleteConfirm = function () {
    Api.Users.delete({
      id: $scope.user.id
    }, function () {
      $location.path('/');
      growl.addSuccessMessage('Your account has been deleted.');
      Api.Users.current();
    });
    $modalInstance.dismiss();
  };
});
