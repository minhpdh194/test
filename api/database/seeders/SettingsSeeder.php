<?php

namespace Database\Seeders;

use App\Models\Settings;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['name' => 'star_price', 'value' => '0.025'],
            ['name' => 'prem_mult', 'value' => '5'],
            ['name' => 'conversion_rate', 'value' => '2'],
            ['name' => 'stars_spent', 'value' => '0']
        ];

        foreach ($settings as $setting) {
            Settings::updateOrCreate(['name' => $setting['name']], $setting);
        }
    }
}
