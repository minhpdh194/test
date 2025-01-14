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
            ['pair_symbol' => ToolsUtil::getPairSymbol('BTC', 'USD'), 'coin_symbol' => 'BTC', 'cmc_id' => 1, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('ETH', 'USD'), 'coin_symbol' => 'ETH', 'cmc_id' => 1027, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('BNB', 'USD'), 'coin_symbol' => 'BNB', 'cmc_id' => 1839, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('SOL', 'USD'), 'coin_symbol' => 'SOL', 'cmc_id' => 5426, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('XRP', 'USD'), 'coin_symbol' => 'XRP', 'cmc_id' => 52, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('UNI', 'USD'), 'coin_symbol' => 'UNI', 'cmc_id' => 7083, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('LINK', 'USD'), 'coin_symbol' => 'LINK', 'cmc_id' => 1975, 'counter_symbol' => 'USD'],
        ];

        foreach ($pairs as $pair) {
            Pair::updateOrCreate(['pair_symbol' => $pair['pair_symbol']], $pair);
        }
    }
}