<?php

namespace App\Services;

use App\Models\MarketData\Spot;
use App\Models\MarketData\Pair;
use Carbon\Carbon;
use Http;

class MarketDataService
{
    public function pairCoin($apiUrl, $ids, $convertTo)
    {
        $parameters = [
            'id' => $ids,
            'convert' => $convertTo,
        ];
        
        // Send the request to CoinMarketCap API
        $response = Http::withHeaders([
            'Accepts' => 'application/json',
            'X-CMC_PRO_API_KEY' => env('CMC_API_KEY')
        ])->get($apiUrl, $parameters);

        $data = $response->json();

        return $data;
    }

    public function getHistoPrices($apiUrl, Pair $pair, $yesterday, $convertTo, $n)
    {
        $parameters = [
            'id' => $pair->cmc_id,
            'time_end' => $yesterday,
            'count' => $n + 1,
            'interval' => "24h",
            'convert' => $convertTo,
        ];
        
        // Send the request to CoinMarketCap API
        $response = Http::withHeaders([
            'Accepts' => 'application/json',
            'X-CMC_PRO_API_KEY' => env('CMC_API_KEY')
        ])->get($apiUrl, $parameters);

        $data = $response->json();

        return $data;
    }

    public function updateOrCreateSpotData($pair, $new_spot_value, $now)
    {
        $cur_spot = Spot::where('pair_id', $pair->id)
            ->orderBy('created_at', 'desc')
            ->first();
            
        $fixing_period = intval($now->hour / 6) * 6;

        // If spot already exists we will update the spot
        if ($cur_spot) {
            $createdAt = Carbon::parse($cur_spot->created_at); // Ensure $cur_spot->created_at is a Carbon instance
            // If same day and same fixing period, we update existing spot
            if ($createdAt->isSameDay($now)) {
                // Update the record
                // If it is same fixing period
                if ($fixing_period == $cur_spot->fixing_period) {
                    $cur_spot->update([
                        'prev_value' => $cur_spot->current_value,
                        'current_value' => $new_spot_value,
                        'period_return' => (($new_spot_value - $cur_spot->current_value) / $cur_spot->current_value),
                        'daily_return' => (($new_spot_value - $cur_spot->day_open_value) / $cur_spot->day_open_value),
                    ]);
                } else {
                    $cur_spot->update([
                        'fixing_period' => $fixing_period,
                        'period_open_value' => $new_spot_value,
                        'prev_value' => $cur_spot->current_value,
                        'current_value' => $new_spot_value,
                        'period_return' => 0,
                        'daily_return' => (($new_spot_value - $cur_spot->day_open_value) / $cur_spot->day_open_value),
                    ]);
                }
            } else {
                // Create a new record if we are not the same day
                Spot::create([
                    'pair_id' => $pair->id,
                    'fixing_period' => 0,
                    'period_open_value' => $new_spot_value,
                    'day_open_value' => $new_spot_value,
                    'prev_value' => $new_spot_value,
                    'current_value' => $new_spot_value,
                    'period_return' => 0,
                    'daily_return' => 0,
                    'created_at' => $now
                ]);
            }
        // If we are the same day, we update the latest spot value
        } else {
            // If there is no spot in the first run
            Spot::create([
                'pair_id' => $pair->id,
                'fixing_period' => $fixing_period,
                'day_open_value' => $new_spot_value,
                'period_open_value' => $new_spot_value,
                'prev_value' => $new_spot_value,
                'current_value' => $new_spot_value,
                'period_return' => 0,
                'daily_return' => 0,
                'created_at' => $now
            ]);
        }

        $createdSpot = Spot::where('pair_id', $pair->id)->orderBy('created_at', 'desc')->first();
        $createdSpot->load('pair');
        return $createdSpot;
    }

    public function getLatestSpotFilteredByPairFormat($coin_symbol, $counter_symbol)
    {
        return Spot::join('pairs', 'historical_spots.pair_id', '=', 'pairs.id')
            ->where('pairs.coin_symbol', $coin_symbol)
            ->where('pairs.counter_symbol', $counter_symbol)
            ->orderBy('historical_spots.created_at', 'desc')
            ->first();
    }
}
