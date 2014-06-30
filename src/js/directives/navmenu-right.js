angular.module('app')

.directive('navMenuRight', function (AuthService, $location, $rootScope) {
  return {
    restrict: 'A',
    templateUrl: '/views/navmenu-right.html',
    transclude: true,
    link: function (scope, element, attrs) {

      // When initializing the app or when current user changes (login/logout)
      // Update the user scope
      scope.user = {};
      scope.isAdmin = false;
      scope.$watch(AuthService.getCurrentUser, function () {
        scope.user = AuthService.getCurrentUser();
        console.log('user', scope.user);
        scope.isAdmin = AuthService.userCanAccess('admin');
      });

      scope.showMenu = 'main';

      var li, link, links, currentListItem, i, href,
      listItems = element.find('li'),
      urlMap = {};

      for (i = 0; i < listItems.length; i++) {
        li = angular.element(listItems[i]);
        links = li.find( 'a');
        if (links.length <= 0) {
          continue;
        }

        link = angular.element(links[0]);

        if ($location.$$html5) {
          // HTML5 Mode History
          href = link.attr('href');
        } else {
          // HTML4 hash
          href = link.attr('href').replace(/^#/,'');
        }

        urlMap[href] = li;
      }

      var setActive = function () {
        // Main or admin menu ?
        //if (_(['/admin']).contains($location.path())) {
        if ($location.path().match(/^\/admin/)) {
          scope.showMenu = 'admin';
        } else {
          scope.showMenu = 'main';
        }
        var pathListItem = urlMap[$location.path()];

        if (pathListItem) {
          if (currentListItem) {
            currentListItem.removeClass('active');
          }
          currentListItem = pathListItem;
          currentListItem.addClass('active');
        }
      };
      setActive();

      scope.$on('$routeChangeStart', setActive);

    }
  };
});
