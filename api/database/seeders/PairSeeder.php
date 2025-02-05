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
            ['pair_symbol' => ToolsUtil::getPairSymbol('TON', 'USD'), 'coin_symbol' => 'TON', 'cmc_id' => 11419, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('XRP', 'USD'), 'coin_symbol' => 'XRP', 'cmc_id' => 52, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('DOGE', 'USD'), 'coin_symbol' => 'DOGE', 'cmc_id' => 74, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('ADA', 'USD'), 'coin_symbol' => 'ADA', 'cmc_id' => 2010, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('UNI', 'USD'), 'coin_symbol' => 'UNI', 'cmc_id' => 7083, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('LINK', 'USD'), 'coin_symbol' => 'LINK', 'cmc_id' => 1975, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('LTC', 'USD'), 'coin_symbol' => 'LTC', 'cmc_id' => 2, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('AAVE', 'USD'), 'coin_symbol' => 'AAVE', 'cmc_id' => 7278, 'counter_symbol' => 'USD'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('BTC', 'ETH'), 'coin_symbol' => 'BTC', 'cmc_id' => 0, 'counter_symbol' => 'ETH'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('ETH', 'SOL'), 'coin_symbol' => 'ETH', 'cmc_id' => 0, 'counter_symbol' => 'SOL'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('BTC', 'TON'), 'coin_symbol' => 'BTC', 'cmc_id' => 0, 'counter_symbol' => 'TON'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('SOL', 'TON'), 'coin_symbol' => 'SOL', 'cmc_id' => 0, 'counter_symbol' => 'TON'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('DOGE', 'TON'), 'coin_symbol' => 'DOGE', 'cmc_id' => 0, 'counter_symbol' => 'TON'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('ETH', 'ADA'), 'coin_symbol' => 'ETH', 'cmc_id' => 0, 'counter_symbol' => 'ADA'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('BTC', 'LTC'), 'coin_symbol' => 'BTC', 'cmc_id' => 0, 'counter_symbol' => 'LTC'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('TON', 'UNI'), 'coin_symbol' => 'TON', 'cmc_id' => 0, 'counter_symbol' => 'UNI'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('LINK', 'AAVE'), 'coin_symbol' => 'LINK', 'cmc_id' => 0, 'counter_symbol' => 'AAVE'],
            ['pair_symbol' => ToolsUtil::getPairSymbol('LTC', 'DOGE'), 'coin_symbol' => 'LTC', 'cmc_id' => 0, 'counter_symbol' => 'DOGE'],
        ];

        foreach ($pairs as $pair) {
            Pair::updateOrCreate(['pair_symbol' => $pair['pair_symbol']], $pair);
        }
    }
}