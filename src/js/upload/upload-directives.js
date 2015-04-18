
app.directive('uploader', function ($upload, growl) {
    return {
        restrict: 'A',
        scope: {
            image: '=uploader'
        },
        template: '<div class="uploader"><div ng-if="image"><img class="img-responsive" ng-src="/image/medium/{{ image.filename }}" /><button type="button" class="btn btn-danger" ng-click="doRemoveImage()">Remove</button></div><div ng-if="!image"><button type="button" class="btn btn-default" ng-file-select="doFileSelect($files)">Upload Image</button></div></div>',
        controller: function ($scope) {
            console.log('image', $scope.image);
            $scope.fileUploadObj = {};
            $scope.doFileSelect = function ($files) {
                var $file = $files[0];
                $scope.upload = $upload.upload({
                    url: "/api/uploads",
                    method: "POST",
                    data: { fileUploadObj: $scope.fileUploadObj },
                    file: $file
                }).success(function (data, status, headers, config) {
                    // file is uploaded successfully
                    $scope.image = data;
                }).error(function (data, status, headers, config) {
                    // file failed to upload
                    growl.error("Error uploading image");
                });
            };
            $scope.doRemoveImage = function () {
                $scope.image = null;
            };
        }
    };
});
