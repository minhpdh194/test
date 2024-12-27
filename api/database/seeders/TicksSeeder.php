<?php

namespace Database\Seeders;

use App\Models\MarketData\Ticks;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ticks = [
            ['coin_symbol' => 'BTC', 'value' => 1000],
            ['coin_symbol' => 'ETH', 'value' => 100],
            ['coin_symbol' => 'BNB', 'value' => 10],
            ['coin_symbol' => 'SOL', 'value' => 2]
        ];

        foreach ($ticks as $tick) {
            Ticks::updateOrCreate(['coin_symbol' => $tick['coin_symbol']], $tick);
        }
    }
}