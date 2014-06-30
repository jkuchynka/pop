angular.module('app')

.factory('AuthService', function ($rootScope, growl, Restangular, CSRF_TOKEN) {

  var loginSuccess = function (response) {
    growl.addSuccessMessage("Welcome back, " + response.username);
  };

  var loginError = function (response) {
    growl.addErrorMessage(response.error);
  };

  var loadCurrentUser = function () {
    currentUser = Restangular.one('auth/current').get().$object;
    return currentUser;
  };

  var currentUser = {};

  return {
    login: function (creds) {
      var sanCreds = {
        email: creds.email,
        password: creds.password,
        csrf_token: CSRF_TOKEN
      };
      var login = Restangular
        .all('auth')
        .post(sanCreds)
        .then(function (response) {
          loadCurrentUser();
          loginSuccess(response);
        }, loginError);
      return login;
    },
    getCurrentUser: function() {
      return currentUser;
    },
    loadCurrentUser: loadCurrentUser,
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
