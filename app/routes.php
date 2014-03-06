<?php

/**
 * Catchall route.
 * Any routes that aren't already matched by laravel should
 * be passed on to angular's routing.
 */
Route::any('{all}', function()
{
	// Return the built index.html file from public/
	return file_get_contents(__DIR__ .'/../public/index.html');
})->where('all', '.*');

/**
 * Api calls to the laravel app
 */
Route::group(array('prefix' => 'api'), function()
{

});
