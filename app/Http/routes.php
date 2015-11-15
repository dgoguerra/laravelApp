<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::resource('users','usersController', ['only' => ['index']]);

Route::GET('movies','moviesController@see');

/* No sé por qué no me deja POST, espero a ver cuándo metamos el $.POST*/ 
Route::any('movies/{imbd_id}/{name}','moviesController@add');