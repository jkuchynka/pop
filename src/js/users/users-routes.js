
app.config(function ($stateProvider) {
    $stateProvider
        .state('users', {
            url: '/users',
            abstract: true,
            controller: function () {},
            template: '<div ui-view></div>'
        })
        .state('users.login', {
            url: '^/login',
            controller: 'UsersLoginCtrl',
            templateUrl: '/assets/views/users/users-login.html',
            title: 'Login',
            auth: {
                authed: false
            }
        })
        .state('users.register', {
            url: '^/register',
            controller: 'UsersRegisterCtrl',
            templateUrl: '/assets/views/users/users-register.html',
            title: 'Register',
            auth: {
                authed: false
            }
        })
        .state('users.profile', {
            url: '^/profile',
            controller: 'UsersProfileCtrl',
            templateUrl: '/assets/views/users/users-profile.html',
            title: 'Profile',
            resolve: {
                user: function (store) {
                    return store.get('user');
                }
            },
            auth: {
                authed: true
            }
        })
        .state('users.confirm', {
            url: '/confirm/:confirmcode',
            controller: 'UsersConfirmCtrl',
            template: ''
        })
        .state('users.password.success', {
            url: '/password/success',
            controller: 'UsersPasswordCtrl',
            templateUrl: '/assets/views/users/password/users-password-success.html'
        })
        .state('users.reset', {
            url: '/reset',
            controller: 'UsersResetCtrl',
            templateUrl: '/assets/views/users/users-reset.html'
        })
        .state('users.reset.invalid', {
            url: '/reset/invalid',
            controller: 'UsersResetInvalidCtrl',
            templateUrl: '/assets/views/users/reset/users-reset-invalid.html'
        })
        .state('users.reset.success', {
            url: '/reset/success',
            controller: 'UsersResetSuccessCtrl',
            templateUrl: '/assets/views/users/reset/users-reset-success.html'
        })
        .state('users.reset.token', {
            url: '/reset/:token',
            controller: 'UsersPasswordCtrl',
            templateUrl: '/assets/views/users/users-password.html'
        });
});
