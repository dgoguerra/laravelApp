<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class moviesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function see()
    {
            {
        // $movies es el array que voy a devolver convertido en json
        $movies = array ("success" => true);
        // Obtengo todas las películas
        $peliculas = \DB::table('movies')
                -> select ('id','imbd_id','name')
                -> get();
        
        // Las convierto en un array
        $peliculas = json_decode(json_encode($peliculas),true);
        // Las añado a $movies
        $movies["peliculas"] = $peliculas;
        //Lo devuelvo convertido en json
        return \Response::json($movies);
    }
    }

    
    // Añade nuevas películas a la base de datos
    public function add($imbd_id, $name)
    {
        /*De moemnto incluyo JQUERY con descarga porque no sé dónde meterlo en Laravel5 */
        echo '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>';
        echo "<h1>". $imbd_id . " y " . $name .  "</h1>";

    }

   
}
