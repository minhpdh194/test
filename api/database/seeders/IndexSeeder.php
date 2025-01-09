<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MarketData\Index;

class IndexSeeder extends Seeder
{
    function getTimestamp() {
        $ts = time();
        $fixing = (int)($ts / 120) * 120;
        return $fixing;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //$ts = $ts;
        /*$indices = [
            ['histo_record' => 1, 'pair_id' => 1, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 1, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 2, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 2, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 3, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 3, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 4, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 4, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 5, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 5, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 6, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 6, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 7, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 7, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
        ];*/

        $indices = [
            ['histo_record' => 1, 'pair_id' => 1, 'long_short' => 'long', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 1, 'long_short' => 'short', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 2, 'long_short' => 'long', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 2, 'long_short' => 'short', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 3, 'long_short' => 'long', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 3, 'long_short' => 'short', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 4, 'long_short' => 'long', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 4, 'long_short' => 'short', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 5, 'long_short' => 'long', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 5, 'long_short' => 'short', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 6, 'long_short' => 'long', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 6, 'long_short' => 'short', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 7, 'long_short' => 'long', 'value' => 0],
            ['histo_record' => 1, 'pair_id' => 7, 'long_short' => 'short', 'value' => 0],
        ];

        foreach ($indices as $index) {
            Index::create($index);
        }
    }
}