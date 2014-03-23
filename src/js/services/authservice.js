angular.module('app')

.factory('AuthService', function ($http, $rootScope, Flash, CSRF_TOKEN) {

  var loginSuccess = function (response) {
    Flash.show("Welcome back, " + response.username);
  };

  var loginError = function (response) {
    Flash.show(response.error);
  };

  var currentUser = {};

  return {
    login: function (creds) {
      var sanCreds = {
        email: creds.email,
        password: creds.password,
        csrf_token: CSRF_TOKEN
      };
      var login = $http.post('/api/users/login', sanCreds);
      login.success(Flash.clear);
      login.success(this.loadCurrentUser);
      login.success(loginSuccess);
      login.error(loginError);
      return login;
    },
    getCurrentUser: function() {
      return currentUser;
    },
    loadCurrentUser: function () {
      call = $http.get('/api/users/current');
      call.success(function (response) {
        currentUser = response;
      });
      return call;
    },
    userCanAccess: function (path) {
      var access = false;
      switch (path) {
        case 'admin':
          if (currentUser.roles) {
            angular.forEach(currentUser.roles, function (val) {
              if (val.name == 'admin') {
                access = true;
              }
            });
          }
        break;
      }
      return access;
    }
  };
});
