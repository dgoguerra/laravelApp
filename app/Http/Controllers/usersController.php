<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class usersController extends Controller
{
    
    
    /*
     * Devuelve todos los usuarios y las películas a las que están subscritos
     */
    public function index()
    {
        //Se va a devolver $users, su primer elemento es de comprobación, con índice 'success' y valor 'true'.
        $users = array (
          "success" => true  
        );
        
        
        // Guardo todos los usuarios en $usuarios
        $usuarios = \DB::table('users')
                -> select ('id', 'username')
                -> get();
        
       // Convierto $usuarios en un array
        $usuarios = json_decode(json_encode($usuarios),true);
        
        
        // Añado $usuarios como segundo elemento de $users
        $users["users"] = $usuarios;
        
        foreach ($usuarios as $clave => $usuario) {
         // Obtengo las películas a las que está subscrito cada usuario
            $peliculas = \DB::table('movies')
           -> Join ('user_movie', 'movies.id', '=','user_movie.movie_id')
           -> Where ('user_movie.user_id', '=', $usuario['id'])
           -> select ('movies.id as id_pelicula', 'movies.imbd_id', 'movies.name', 'user_movie.status')
           -> get();  
            
         // Las convierto en un array
            $peliculas = json_decode(json_encode($peliculas),true);
            
            // Lo agrego a su posición en $users
            $users["users"][$clave]["peliculas"] = $peliculas;
        }
        

        return \Response::json($users);
        
         
    }

}
        



 









/*
       // Devuelve un stdClass 
        $consulta = \DB::table('users')
                -> leftJoin ('user_movie', 'users.id','=','user_movie.user_id')
                -> leftJoin ('movies', 'movies.id' , '=', 'user_movie.movie_id')
                -> select ('users.id AS id_usuario','users.username','users.password','movies.id AS id_pelicula','movies.imbd_id','movies.name')
                -> get();
    
      // Lo convierto en un array
      $consulta = json_decode(json_encode($consulta), true);
      
      // Creo un array donde se guardarán todos los usuarios
      $usuarios = array ();
      
      // Comprobamos que funciona
      echo $consulta[0]["id_usuario"];
      */


    
        /*
        
            
            Debo implementar: SELECT movies.id as id_pelicula, movies.name, movies.imbd_id, user_movie.status 
             * from movies, user_movie 
             * where movies.id = user_movie.movie_id and user_movie.user_id=1;
                 
         * // Esto lo devuelve, sólo debo cambiar el 1 por el usuario['id'] y convertir la respuesta en un array, y guardarlo en un nuevo índice 'peliculas'
         *         $peliculas = \DB::table('movies')
        -> Join ('user_movie', 'movies.id', '=','user_movie.movie_id')
        -> Where ('user_movie.user_id', '=', 1)
        -> select ('movies.id as id_pelicula', 'movies.imbd_id', 'movies.name', 'user_movie.status')
        -> get();  
         *     return $peliculas;   
        }
         * 
         * 
        */