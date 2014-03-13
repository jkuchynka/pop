angular.module('app')

.factory('UserService', function ($http, FlashService) {
  return {
    getUserByUsername: function (name) {
      var user = $http.get('/api/user/show/' + name);
      return user;
    }
  };
});
