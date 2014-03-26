## Pop

Pop is a Laravel 4 and AngularJS SPA starter site.

Use it to jumpstart a project, or just to learn some new things about Laravel and AngularJS interaction. Currently, it is biased about the external dependencies it uses and the way it is setup, so make sure you understand any limitations before using it for your app. Or, be open to customizing it to your needs.


## Features

Admin section

Manage users

Manage roles


## Architecture

In this project, Angular is setup as a SPA (single page app). It handles all the routes, views, anything that happens on the client side, and interacts with the server (laravel) via REST json services. This makes for a nice separation of server and client concerns, but has a few limitations (namely SEO). See more here: http://popwords.net/issues-with-spa .

Here's a quick glance of 3rd party libraries used by pop:


### Frontend:

bootstrap
angular
jquery
jade
less


### Backend:

Laravel 4
Ardent
Confide
Entrust
Woodling


### Package management:

composer
bower
npm


### Testing:

phpunit


### Development/Build:

gulp
less


## Getting started

$ git clone http://github.com/jbizzay/pop newapp

$ cd newapp

$ composer update

$ bower install

$ npm install

$ gulp

$ php artisan migrate

$ php artisan db:seed

$ php artisan serve --port=8000
