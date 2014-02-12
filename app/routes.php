<?php

// If no other route matches, return master view
Route::get('{any}', function()
{
	return View::make('pop/master');
});
// Homepage, return master view
Route::get('/', function()
{
	return View::make('pop/master');
});

// Api rest services
Route::group(array('prefix' => 'api'), function()
{

});