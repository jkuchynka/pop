angular.module('app')

.controller('UsersEditController', function ($location, $scope, $rootScope, $http, $modal, $routeParams, $timeout, $upload, growl, mode, Restangular, Api) {

    var init = function () {
        $scope.roles = Api.Roles.getList().$object;
        if (mode == 'edit') {
            Api.Users.getList({
                'where[]': 'username,' + $routeParams.username,
                'with[]': ['image', 'roles'] }).then(function (users) {
                    console.log('editing user: ', users);
                    $scope.user = users[0];
                    $rootScope.pageTitle('Edit user: ' + $scope.user.username);
                    _.each($scope.user.roles, function (value) {
                        $scope.selectedRoles.push(value.id);
                    });
                }, function (response) {
                    growl.addErrorMessage(response.data.errors[0]);
                });
        } else {
            $rootScope.pageTitle('Add user');
        }
    };

    var deleteUser = function () {
        var modal = $modal.open({
            templateUrl: 'modalDeleteAccount',
            controller: 'UserEditModalCtrl'
        });
    };

    var fileAbortUpload = function (index) {
        $scope.upload[index].abort();
    };

    var fileSelect = function ($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            (function (index) {
                $scope.upload[index] = $upload.upload({
                    url: "/api/uploads",
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

    var removeImage = function () {
        $scope.user.image = null;
    };

    var saveUser = function () {
        if ($scope.mode == 'edit') {
            $scope.user.roles = $scope.selectedRoles;
            $scope.user
                .put()
                .then(function (response) {
                    growl.addSuccessMessage('Success! Your profile has been updated.');
                    //AuthService.loadCurrentUser();
                    $location.path('/user/' + $scope.user.username);
                }, function (response) {
                    growl.addErrorMessage("Error updating profile: " + response.data.errors[0]);
                })
            ;
        }
        if ($scope.mode == 'create') {
            $scope.user.roles = $scope.selectedRoles;
            Api.Users.post($scope.user)
                .then(function (user) {
                    growl.addSuccessMessage('Success! User ' + user.username + ' created.');
                    $location.path('/user/' + user.username);
                }, function (response) {
                    growl.addErrorMessage('Error creating new user: ' + response.data.errors[0]);
                })
            ;
        }
    };

    var setPageTitle = function () {
        if ($scope.mode == 'edit') {
            //console.log('pagetitle', AuthService.getCurrentUser().id, $scope.user.id);
           /* if (AuthService.getCurrentUser().id == $scope.user.id) {
                $rootScope.pageTitle('Edit Your Profile');
            } else {
                $rootScope.pageTitle('Edit User: ' + $scope.user.username);
            }*/
        }
    };

    // Setup scope
    $scope.fileUploadObj = {};
    $scope.mode = mode;
    $scope.roles = [];
    $scope.selectedRoles = [];
    $scope.upload = [];
    $scope.user = {};

    $scope.abortUpload = fileAbortUpload;
    $scope.delete = deleteUser;
    $scope.onFileSelect = fileSelect;
    $scope.removeImage = removeImage;
    $scope.save = saveUser;

    // Initialize controller
    init();
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
