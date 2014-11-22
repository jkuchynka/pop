angular.module('app')

.directive('headerCrumbs', function ($location, $rootScope) {
    return {
        restrict: 'A',
        template: '<a ng-repeat="link in links" class="navbar-brand" ng-class="{{ link.class }}" ng-href="{{ link.href }}" ng-bind-html="link.text"></a>',
        link: function (scope, element, attrs) {
            $rootScope.$on('$locationChangeStart', function (evt, next, current) {
                scope.links = [
                    {
                        href: '#/',
                        text: '<i class="fa fa-lg fa-home"></i>'
                    }
                ];
                var parts = $location.path().split('/');
                var path = '#';
                for (var i = 1; i < parts.length; i++) {
                    if (parts[i]) {
                        path += '/' + parts[i];
                        scope.links.push({
                            href: '',
                            text: '/',
                            class: ['sep']
                        });
                        scope.links.push({
                            href: path,
                            text: parts[i],
                            class: []
                        });
                    }
                }
            }, true);
        }
  };
});
