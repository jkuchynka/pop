<?php


/**
 * Api calls to the laravel app
 */
Route::group(array('prefix' => 'api'), function()
{
  Route::controller('user', 'UserController');
});

// When logging out, calls the server directly and redirect back to
// the app's homepage
Route::get('logout', function () {
  Confide::logout();
  return Redirect::to('/');
});

// Confide RESTful route
Route::get('user/confirm/{code}', 'UserController@getConfirm');
Route::get('user/reset/{token}', 'UserController@getReset');
//Route::controller( 'user', 'UserController');

/**
 * Catchall route.
 * Any routes that aren't already matched by laravel should
 * be passed on to angular's routing.
 */
Route::any('{all}', function()
{
  // Return the built index.html file from public/
  $index = file_get_contents(__DIR__ .'/../public/index.html');
  // Inject CSRF
  return str_replace('INJECT_CSRF_TOKEN', csrf_token(), $index);
})->where('all', '.*');
