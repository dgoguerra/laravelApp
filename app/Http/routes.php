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

//Ruta para comprobar rápidamente que el servidor y la conexión funcionan
Route::get('/', function () {
    return view('welcome');
});


Route::get('admin',function(){
    return view ('admin');
});
//Ruta para mostrar todos los usuarios y la información de las películas a las que están suscritos
Route::get('users','UsersController@index');
// Ruta para mostrar todas las películas
Route::get('movies','MoviesController@index');
//Ruta para añadir una nueva película a la base de datos (recibe el imbd_id y el nombre por parámetros)
Route::post('movies','MoviesController@newMovie');
//Ruta para añadir una nueva suscripción de una película a un usuario (recibe el movie_id por parámetro)
Route::post('users/{userid}/movies',  'UsersController@newSubscription');
//Ruta para modificar el estado de la suscripción de un usuario a una película (recibe el status por parámetro)
Route::put('users/{userid}/movies/{movieid}', 'UsersController@updateSubscription');
//Ruta para eliminar la suscripción de un usuario a una película
Route::delete('/users/{userid}/movies/{movieid}', 'UsersController@deleteSubscription');
//