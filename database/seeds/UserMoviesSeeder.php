<?php


use Illuminate\Database\Seeder;
class UserMoviesSeeder extends Seeder {
    
    public function run () {
        
        /*Si repueblo la tabla no quiero duplicar estos datos, así que los borro
         * Hago un truncate() y no un delete() porque quiero que los campos autoincrementables
         * también se reinicien, o tendré problemas con las claves ajenas que hacen referencia a dichos campso
         */
        
        \DB::table("user_movie") -> truncate();
        $data = array (
            array (
                "user_id" => 1,
                "movie_id" => 1,
                "status" => "s"
            ),
            
            array (
                "user_id" => 1,
                "movie_id" => 2,
                "status" => "s"
            ),
            array (
                "user_id" => 2,
                "movie_id" => 2,
                "status" => "p"
            ),
            array (
                "user_id" => 1,
                "movie_id" => 3,
                "status" => "s"
            ),
            array (
                "user_id" => 3,
                "movie_id" => 1,
                "status" => "n"
            ),
            array (
                "user_id" => 2,
                "movie_id" => 4,
                "status" => "n"
            ),
            array (
                "user_id" => 1,
                "movie_id" => 5,
                "status" => "s"
            ),
            array (
                "user_id" => 2,
                "movie_id" => 7,
                "status" => "p"
            )
        );
        
    \DB::table("user_movie") -> insert ($data);
    }
}
