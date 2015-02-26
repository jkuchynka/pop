
app.config(function ($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            controller: 'HomeCtrl',
            templateUrl: '/assets/views/home/home.html'
        });
});
