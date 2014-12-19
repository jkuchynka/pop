angular.module('app')

.controller('PagesAboutController', function ($scope, $rootScope) {

    $rootScope.pageTitle('About Pop');

    $scope.links = [
        ['Pop',
            [
                ['Pop', 'https://github.com/jbizzay/pop/']
            ],
        ],
        ['Front End',
            [
                ['AngularJS', 'https://docs.angularjs.org/'],
                ['Bootstrap', 'http://getbootstrap.com/'],
                ['Bootswatch Themes', 'http://bootswatch.com/'],
                ['Bootswatch Bower Install', 'https://github.com/dbtek/bootswatch-dist'],
                ['Angular UI Bootstrap', 'http://angular-ui.github.io/bootstrap/'],
                ['Angular Form Errors', 'https://github.com/CWSpear/angular-form-errors-directive'],
                ['Jade', 'http://jade-lang.com/'],
                ['Jade Converter', 'http://html2jade.org/']
            ]
        ],
        ['Laravel / PHP',
            [
                ['Laravel', 'http://laravel.com/docs/4.2'],
                ['Laravel Cheat Sheet', 'http://cheats.jesse-obrien.ca/'],
                ['Find a Laravel Package', 'http://packalyst.com/'],
                ['Find a Composer Package', 'https://packagist.org/'],
                ['Ardent', 'https://github.com/laravelbook/ardent'],
                ['Confide', 'https://github.com/Zizaco/confide'],
                ['Magma', 'https://github.com/jbizzay/magma'],
                ['Intervention ImageCache', 'http://image.intervention.io/use/url']
            ]
        ]
    ];

});
