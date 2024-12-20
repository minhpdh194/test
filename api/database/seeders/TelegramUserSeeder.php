<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TelegramUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('telegram_users')->insert([
            [
                'telegram_id' => 1,
                'first_name' => 'John',
                'last_name' => 'Doe',
                'username' => 'johndoe',
                'balance' => 10000.00,
                'earn_per_tap' => 10,
                'available_energy' => 500,
                'multi_tap_level' => 2,
                'energy_limit_level' => 3,
                'booster_pack_2x' => 0,
                'booster_pack_3x' => 0,
                'booster_pack_7x' => 0,
                'booster_pack_active_until' => now()->addDays(7),
                'login_streak' => 5,
                'daily_booster_uses' => 1,
                'last_daily_booster_use' => now()->subDay(),
                'production_per_hour' => 50,
                'referred_by' => null,
                'level_id' => 1,
                'remember_token' => Str::random(10),
                'last_login_date' => now(),
                'last_tap_date' => now(),
                'total_login_days' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
