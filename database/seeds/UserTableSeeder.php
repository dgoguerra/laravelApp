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
        $data = [
            'username' => 'user_1',
            'password' => \Hash::make('secret')
        ];

        \DB::table('users')->insert($data);
    }
}
