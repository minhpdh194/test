<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Utils\ToolsUtil;
use App\Models\MarketData\Pair;

class PairSeeder extends Seeder
{
    /**
     * Run the database seeds.
    */
    public function run(): void
    {
        $pairs = [
            ['pair_symbol' => ToolsUtil::getPairSymbol('BTC', 'USD'), 'coin_symbol' => 'BTC', 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('ETH', 'USD'), 'coin_symbol' => 'ETH', 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('BNB', 'USD'), 'coin_symbol' => 'BNB', 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('SOL', 'USD'), 'coin_symbol' => 'SOL', 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('XRP', 'USD'), 'coin_symbol' => 'XRP', 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('UNI', 'USD'), 'coin_symbol' => 'UNI', 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('LINK', 'USD'), 'coin_symbol' => 'LINK', 'counter_symbol' => 'USD'],
        ];

        foreach ($pairs as $pair) {
            Pair::updateOrCreate(['pair_symbol' => $pair['pair_symbol']], $pair);
        }
    }
}
