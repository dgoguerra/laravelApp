<?php
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
        /*En las clases seeder he hecho tuncate() de las tablas que estoy repoblando,
         * pero MYSQL no permite hacer truncate() sobre una tabla que tiene campos que son
         * referenciados por cambos ajenos de otras tablas, así que debo desactivar las claves ajenas,
         * hacer los truncates, y reactivarlas.
         */
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        $this-> call(UserTableSeeder::class);
        $this -> call(MovieTableSeeder::class);
        $this -> call(UserMoviesSeeder::class);
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        Model::reguard();
    }
}
