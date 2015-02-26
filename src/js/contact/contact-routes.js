
app.config(function ($stateProvider) {
    $stateProvider
        .state('contact', {
            url: '/contact',
            controller: 'ContactCtrl',
            templateUrl: '/assets/views/contact/contact.html'
        });
});
