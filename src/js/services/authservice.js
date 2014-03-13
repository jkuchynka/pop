angular.module('app')

.factory('AuthService', function ($http, $rootScope, FlashService, CSRF_TOKEN) {

  var loginSuccess = function (response) {
    FlashService.show("Welcome back, " + response.username);
  };

  var loginError = function (response) {
    FlashService.show(response.error);
  };

  var currentUser = {};

  return {
    login: function (creds) {
      var sanCreds = {
        email: creds.email,
        password: creds.password,
        csrf_token: CSRF_TOKEN
      };
      var login = $http.post('/api/user/login', sanCreds);
      login.success(FlashService.clear);
      login.success(this.loadCurrentUser);
      login.success(loginSuccess);
      login.error(loginError);
      return login;
    },
    getCurrentUser: function() {
      return currentUser;
    },
    loadCurrentUser: function () {
      call = $http.get('/api/user/current');
      call.success(function (response) {
        currentUser = response;
      });
      return call;
    }
  };
});
