<?php


/**
 * Api calls to the laravel app
 */
Route::group(array('prefix' => 'api'), function()
{

  Route::group(array('prefix' => 'users'), function () {
    Route::post('login', 'UserController@postLogin');
    Route::get('current', 'UserController@getCurrent');
    Route::get('logout', 'UserController@getLogout');
    Route::put('confirm', 'UserController@putConfirm');
    Route::post('forgot', 'UserController@postForgot');
    Route::post('reset', 'UserController@postReset');
    Route::post('image/{id}', 'UserController@postImage');
  });
  Route::resource('users', 'UserController', array(
    'only' => array('index', 'store', 'show', 'update', 'destroy')
  ));

  Route::resource('roles', 'RoleController', array(
    'only' => array('index', 'store', 'show', 'update', 'destroy')
  ));

  Route::resource('upload', 'UploadController', array(
    'only' => array('index', 'store', 'show')
  ));

  Route::controller('upload', 'UploadController');

});

// If a file doesn't exist in the public/image folder yet,
// Laravel will call this route.
// Generate the image and return it
Route::get('image/{size}/{file}', 'ImageController@getImage')->where('file', '.*');

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
Route::any('{all}', function()
{
  // If route starts with api and the route wasn't matched, return an error response
  if (Request::is('api/*')) {
    return Response::json(array(
      'error' => 'Unknown route: '. Request::path()
    ), 400);
  }
  // Return the built index.html file from public/
  $index = file_get_contents(__DIR__ .'/../public/index.html');
  // Inject CSRF
  return str_replace('INJECT_CSRF_TOKEN', csrf_token(), $index);
})->where('all', '.*');

