
app.config(function ($stateProvider) {
    $stateProvider
        .state('about', {
            url: '/about',
            controller: 'AboutCtrl',
            templateUrl: '/assets/views/about/about.html'
        });
});
