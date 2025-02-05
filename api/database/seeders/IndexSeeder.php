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
        $ts = $this->getTimestamp();
        $indices = [
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
            ['histo_record' => 1, 'pair_id' => 8, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 8, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 9, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 9, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 10, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 10, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 11, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 11, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 12, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 12, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 13, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 13, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 14, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 14, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 15, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 15, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 16, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 16, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 17, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 17, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 18, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 18, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 19, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 19, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 20, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 20, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 21, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 21, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 22, 'long_short' => 'long', 'value' => 0, 'created_at' => $ts],
            ['histo_record' => 1, 'pair_id' => 22, 'long_short' => 'short', 'value' => 0, 'created_at' => $ts],
        ];

        foreach ($indices as $index) {
            Index::create($index);
        }
    }
}