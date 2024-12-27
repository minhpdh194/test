<?php

namespace Database\Seeders;

use App\Models\Settings;
use App\Models\StarsDefinition;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StarsDefinitionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $starPrice = Settings::first()->star_price;
        if ($starPrice && $starPrice > 0) {
            $data = [
                [1, 50, 50 * $starPrice, 0],
                [2, 100, 100 * $starPrice, 5],
                [3, 250, 250 * $starPrice, 10],
                [4, 500, 500 * $starPrice, 20],
                [5, 1000, 1000 * $starPrice, 30],
            ];

            // Insert the data into the database
            foreach ($data as $item) {
                StarsDefinition::updateOrCreate(
                    ['id' => $item[0]],
                    [
                        'number_of_stars' => $item[1],
                        'price' => $item[2],
                        'discount' => $item[3],
                    ]
                );
            }
        }
    }
}
