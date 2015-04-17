
app.config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
});

app.factory('Api', function (Restangular, $q) {

    Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {

    });

    var api = Restangular.withConfig(angular.noop);

    return api;
});
