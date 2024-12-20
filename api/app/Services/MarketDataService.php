<?php

namespace App\Services;

use App\Models\MarketData\Spot;
use App\Models\MarketData\Pair;
use Carbon\Carbon;
use Http;

class MarketDataService
{
    public function pairCoin($apiUrl, $symbol, $convertTo)
    {
        $parameters = [
            'symbol' => $symbol,
            'convert' => $convertTo,
        ];
        $isSpotCreatedOrUpdated = false;
        // Send the request to CoinMarketCap API
        $response = Http::withHeaders([
            'Accepts' => 'application/json',
            'X-CMC_PRO_API_KEY' => env('CMC_API_KEY')
        ])->get($apiUrl, $parameters);

        $data = $response->json();

        return $data;
    }

    public function updateOrCreateSpotData($crypto_data, $pair, $new_spot_value)
    {
        if ($crypto_data) {
            $cur_spot = Spot::where('pair_id', $pair->id)
                ->orderBy('created_at', 'desc')
                ->first();

            // $spot should NEVER be null
            // new spot value should NEVER be null or 0
            // if(!$cur_spot || !$new_spot || $new_spot == 0) {
            //     return null;
            // }

            // If spot already exists we will update the spot
            if ($cur_spot) {
                $createdAt = Carbon::parse($cur_spot->created_at); // Ensure $cur_spot->created_at is a Carbon instance
                if ($createdAt->isSameDay(Carbon::now())) {
                    // Update the record
                    $cur_spot->update([
                        'current_value' => $new_spot_value,
                        'prev_value' => $cur_spot->current_value,
                        'daily_return' => (($new_spot_value - $cur_spot->current_value) / $cur_spot->current_value),
                    ]);
                    $isSpotCreatedOrUpdated = true;
                } else {
                    // Create a new record if we are not the same day
                    Spot::create([
                        'pair_id' => $pair->id,
                        'prev_value' => $cur_spot->current_value,
                        'current_value' => $new_spot_value,
                        'daily_return' => ($new_spot_value / $cur_spot->prev_value - 1),
                    ]);
                    $isSpotCreatedOrUpdated = true;
                }
                // If we are the same day, we update the latest spot value
            } else {
                // If there is no spot in the first run
                Spot::create([
                    'pair_id' => $pair->id,
                    'prev_value' => $new_spot_value,
                    'current_value' => $new_spot_value,
                    'daily_return' => 0,
                ]);
                $isSpotCreatedOrUpdated = true;
            }

            // Eagerly load the 'pair' relationship
            if ($isSpotCreatedOrUpdated) {
                $createdSpot = Spot::where('pair_id', $pair->id)->orderBy('created_at', 'desc')->first();
                $createdSpot->load('pair');
                return $createdSpot;
            }

            return null; //should never happen
        }
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
