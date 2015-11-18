<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserMoviesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_movie', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->integer('movie_id')->unsigned();
            $table -> char ('status',1);
            $table->foreign('movie_id')->references('id')->on('movies');
            $table->foreign('user_id')->references('id')->on('users'); 
        });
        //No sé cómo hacer que funcione lo que aquí pretendo: Añadir otra constraint a 'user_movie', la sintaxis sql está bien, ¿no?
        \DB::statement("ALTER TABLE user_movie ADD CONSTRAINT status_restriction check (status in('s','n','p'))");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::drop('user_movie');

    }
}
