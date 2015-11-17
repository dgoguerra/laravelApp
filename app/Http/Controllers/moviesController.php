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

    
    /* Añade nuevas películas a la base de datos. De momento no visualizo cómo voy a recibir
     * el imbd_id y el name con ajax, así que lo dejo preparado coomo variables de $_POST que 
     * es lo que utilizo para probarlo con POSTMAN, y cuando eso esté claro modifico 
     * las variables para ajustarlo a la realidad.
     */
    public function add()
    {
       //Ya veremos cómo, recibo estas dos variables
       $imbd = $_POST["imbd_id"];
       $name = $_POST["name"];
       $return = array ();
       
       
       
       /*Intento añadir un nuevo registro a la tabla "movies". He intentado que no sólo devuelva true si tiene
        * éxito, sino también false si no lo tiene, sin embargo no consigo que el código se siga ejecutando sin que
        * mysql me de un error. He desactivado APP_DEBUG en env para probar, pero ninguna de estas opciones han funcionado,
        * supongo que la razón por la que no lo han hecho es que son válidas para manejar errores de PHP, pero no
        * para tratar los errores que devuelva MYSQL. Para probarlo he hecho unique el campo imbd_id (que además tiene sentido)
        * de modo que si intento introducir dos películas con el mismo imbd_id me devuelva error.
        */
       
       /* Opción I: Con condicionales
       
       if(\DB::table("movies") -> insert (["imbd_id" => $imbd, "name" => $name])) {
        $return["success"] = true;
         }
       else {
        $return["success"] = false;
       }
       */
       
       
       /*Opción II: Tratando excepciones
       try {
           \DB::table("movies") -> insert (["imbd_id" => $imbd, "name" => $name]);
            $return["success"] = true;
       }
       
       catch (exception $e) {
           $return["success"] = false;
       }
       
       finally {
           return \Response::json($return);
       }
       */

       //Finalmente lo he dejado devolviendo sólo true, al ver que de momento no sabía cómo superar lo anterior
       
       if(\DB::table("movies") -> insert (["imbd_id" => $imbd, "name" => $name])) {
        $return["success"] = true;
        return \Response::json($return);
        }
       
      
    }

   
}
