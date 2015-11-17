<?php

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*Si repueblo la tabla no quiero duplicar estos datos, así que los borro
         * Hago un truncate() y no un delete() porque quiero que los campos autoincrementables
         * también se reinicien, o tendré problemas con las claves ajenas que hacen referencia a dichos campso
         */
        \DB::table("users") -> truncate();
        $data = array (
            array (
                "username" => "marie_binion",
                "password" => Hash::make('secret1')
            ),
            array (
                "username" => "paul_mercal",
                "password" => Hash::make("secret2")
            ),
            array (
                "username" => "john34",
                "password" => Hash::make("secret3")
            ),
            array (
                "username" => "NoMovies",
                "password" => Hash::make("secret4")
            )
            
            
        );

        \DB::table('users')->insert($data);
    }
}
