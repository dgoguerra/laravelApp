<?php

use Illuminate\Database\Seeder;

class MovieTableSeeder extends Seeder {
    
    public function run() {
        
        /*Si repueblo la tabla no quiero duplicar estos datos, así que los borro
         * Hago un truncate() y no un delete() porque quiero que los campos autoincrementables
         * también se reinicien, o tendré problemas con las claves ajenas que hacen referencia a dichos campso
         */
        
        \DB::table("movies") -> truncate();
        $data = array (
            array (
                "imbd_id"=> "tt0110912",
                "name" => "Pulp Fiction"
            ),
            array (
                "imbd_id" => "tt0099685",
                "name" => "Uno de los nuestros"
            ),
            array (
                "imbd_id" => "tt0102926",
                "name" => "El silencio de los corderos"
            ),
            array (
                "imbd_id" => "tt0081505",
                "name" => "El resplandor"
            ),
            array (
                "imbd_id" => "tt0169547",
                "name" => "American Beauty"
            ),
            array (
                "imbd_id" =>"tt0268978",
                "name" => "Una mente maravillosa"
            ),
            array (
                "imbd_id" => "tt0405159",
                "name" => "Million dollar Baby"
            )
        );
        
        \DB::table("movies") -> insert ($data);
        
        
        
    }
    
    
}
