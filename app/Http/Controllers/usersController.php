<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class UsersController extends Controller
{
    
    
    /*
     * index () devuelve todos los usuarios y las películas a las que están subscritos
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

    
    /*
     * newSubscription() agrega un nuevo registro a user_movie
     */
    
    public function newSubscription($userid) {
        $movieId = $_POST["movie_id"];
        $return = array ();
        try {
        \DB::table("user_movie")
            -> insert ([
                "user_id" => $userid,
                "movie_id" => $movieId,
                "status" => "n"
                ]);
            $return["success"] = true;
        }  
        catch (\Exception $e) {
            $return["success"] = false;
        }  
        finally {
            return \Response::json($return);
        }       
    }
       
    /*
     * updateSubscription () actualiza el estado de la suscripción de un usuario a una película.
     * Para poder hacer una solicitud a través de PUT creo el elemento $_POST["_method"] = "PUT"
     * y lo envío usando POST.
     */
       
    public function updateSubscription ($userid, $movieid) {
        $new_status = $_POST["new_status"];
        $return = array ();
       if(
               \DB:: table('user_movie') 
               -> where ('user_id', $userid)
               -> where ('movie_id', $movieid)
               -> update (["status" => $new_status])         
         )  {
                 $return["success"] = true;
               }
       else {
             $return["success"] = false;
             }
             
            return \Response::json($return);
       
    }
    
    /*
     * deleteSubscription() elimina un registro de user_movie.
     * Para poder hacer una solicitud a través de DELETE creo el elemento $_POST["method"] = "DELETE"
     * y lo envío usando POST.
     */
    
    public function deleteSubscription ($userid, $movieid) {
       $return = array ();
       if (
               \DB::table('user_movie')
               -> where ('user_id', $userid)
               -> where ('movie_id', $movieid)
               -> delete()
               
          ){
            $return["success"] = true;
          }
        else {
             $return["success"] = false;
        }
        return \Response::json($return);
    }

}






        



 






