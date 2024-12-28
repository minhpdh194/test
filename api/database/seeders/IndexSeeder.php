<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketData\Index;

class IndexSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $indices = [
            ['pair_id' => 1, 'long_short' => 'long', 'value' => 0],
            ['pair_id' => 1, 'long_short' => 'short', 'value' => 0],
            ['pair_id' => 2, 'long_short' => 'long', 'value' => 0],
            ['pair_id' => 2, 'long_short' => 'short', 'value' => 0],
            ['pair_id' => 3, 'long_short' => 'long', 'value' => 0],
            ['pair_id' => 3, 'long_short' => 'short', 'value' => 0],
            ['pair_id' => 4, 'long_short' => 'long', 'value' => 0],
            ['pair_id' => 4, 'long_short' => 'short', 'value' => 0],
            ['pair_id' => 5, 'long_short' => 'long', 'value' => 0],
            ['pair_id' => 5, 'long_short' => 'short', 'value' => 0],
            ['pair_id' => 6, 'long_short' => 'long', 'value' => 0],
            ['pair_id' => 6, 'long_short' => 'short', 'value' => 0],
            ['pair_id' => 7, 'long_short' => 'long', 'value' => 0],
            ['pair_id' => 7, 'long_short' => 'short', 'value' => 0],
        ];

        foreach ($indices as $index) {
            Index::create($index);
        }
    }
}