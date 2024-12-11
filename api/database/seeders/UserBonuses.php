<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class UserBonuses extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // The seeder add bonuses to the user_bonuses table for test 
        // Don't add to the Database Seeder
        // php artisan db:seed --class=UserBonuses  
        DB::table('user_bonuses')->insert([
            [
                'id' => 1,
                'bonus_id' => 1,
                'telegram_user_id' => 1,
                'position_id' => 0,
                'purchase_time' => now(),
                'bonus_type' => 'Leverage',
                'benefit' => 4.00,
                'duration' => 10800,
                'end_date' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'bonus_id' => 2,
                'telegram_user_id' => 1,
                'position_id' => 0,
                'purchase_time' => now(),
                'bonus_type' => 'Leverage',
                'benefit' => 4.00,
                'duration' => 21600,
                'end_date' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
