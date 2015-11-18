<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class MoviesController extends Controller
{

    /*
     * index() devuelve un listado con todas las películas.
     */
    public function index()
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

    
    /* newMovie() añade una nueva película a la base de datos. De momento no visualizo cómo voy a recibir
     * el imbd_id y el name con ajax, así que lo dejo preparado coomo variables de $_POST que 
     * es lo que utilizo para probarlo con POSTMAN, y cuando eso esté claro modifico 
     * las variables para ajustarlo a la realidad.
     */
    public function newMovie()
    {
       //Ya veremos cómo, recibo estas dos variables
       $imbd = $_POST["imbd_id"];
       $name = $_POST["name"];
       $return = array ();
       
       //Compruebo que no se hayan introducido campos vacíos
    if (trim($imbd) != "" && trim($name) != "") {
        try {
            \DB::table("movies") -> insert (["imbd_id" => $imbd, "name" => $name]);
             $return["success"] = true;
        }

        catch (\Exception $e) {
            $return["success"] = false;
        }

        finally {
            return \Response::json($return);
        }
    }
    else {
        $return["success"] = false;
        return \Response::json($return);
    }
  }   
}
