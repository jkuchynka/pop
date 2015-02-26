
app.config(function ($stateProvider) {
    $stateProvider
        .state('components', {
            url: '/components',
            controller: 'ComponentsCtrl',
            templateUrl: '/assets/views/components/components.html'
        })
        .state('components.angularui', {
            url: '/angularui',
            controller: 'PagesComponentsAngularController',
            templateUrl: '/assets/views/components/components-angularui.html'
        })
        .state('components.bootstrap', {
            url: '/bootstrap',
            controller: function () {},
            templateUrl: '/assets/views/components/components-bootstrap.html'
        });
});
