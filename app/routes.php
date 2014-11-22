<?php

use Jbizzay\Magma\MagmaAccess;

/**
 * Api calls to the laravel app
 */
Route::group(['prefix' => 'api'], function()
{

    Route::post('contact', 'Pop\MessageController@contact');

    // Pop routes
    Route::resource('auth', 'Pop\AuthController', [
        'only' => ['store', 'show', 'destroy']
    ]);

    Route::resource('permissions', 'Pop\PermissionController', [
        'only' => ['index', 'update']
    ]);

    Route::resource('roles', 'Pop\RoleController', [
        'only' => ['index', 'store', 'show', 'update', 'destroy']
    ]);

    Route::resource('uploads', 'Pop\UploadController', [
        'only' => ['index', 'store', 'show']
    ]);

    Route::group(['prefix' => 'users'], function () {
        Route::put('confirm', 'Pop\UserController@putConfirm');
        Route::post('forgot', 'Pop\UserController@postForgot');
        Route::post('reset', 'Pop\UserController@postReset');
        Route::post('image/{id}', 'Pop\UserController@postImage');
    });
    Route::resource('users', 'Pop\UserController', [
        'only' => ['index', 'store', 'show', 'update', 'destroy']
    ]);

});

// If a file doesn't exist in the public/image folder yet,
// Laravel will call this route.
// Generate the image and return it
Route::get('image/{size}/{file}', 'Pop\ImageController@getImage')
    ->where('file', '.*');

// When logging out, calls the server directly and redirect back to
// the app's homepage
Route::get('logout', function () {
    Confide::logout();
    return Redirect::to('/');
});

/**
 * Catchall route.
 * Any routes that aren't already matched by laravel should
 * be passed on to angular's routing.
 */
Route::any('{all}', function() {
    // If route starts with api and the route wasn't matched, return an error response
    // If route starts with assets (front-end request) and the route wasn't matched, return an error response
    // @todo: Return error response for html, font, css etc... so we don't return index.html
    if (Request::is('api/*') || Request::is('assets/*')) {
        return Response::json([
            'error' => 'Unknown route: '. Request::path()
        ], 400);
    }
    // Return the built index.html file from public/
    $index = file_get_contents(__DIR__ .'/../public/index.html');
    // Inject CSRF
    return str_replace('INJECT_CSRF_TOKEN', csrf_token(), $index);
})->where('all', '.*');

