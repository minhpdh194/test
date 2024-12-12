<?php

namespace App\Services;

use App\Models\MarketData\Spot;
use App\Models\MarketData\Pair;
use Http;

class MarketDataService
{
    public function pairCoin($apiUrl, $symbol, $convertTo)
    {
        $createdSpots = [];
        $parameters = [
            'symbol' => $symbol,
            'convert' => $convertTo,
        ];

        // Send the request to CoinMarketCap API
        $response = Http::withHeaders([
            'Accepts' => 'application/json',
            'X-CMC_PRO_API_KEY' => 'f919b0f4-ec47-481b-9781-d40474fec8ed'
        ])->get($apiUrl, $parameters);

        $ts = now();
        $data = $response->json();

        if (isset($data['data'])) {
            foreach ($data['data'] as $crypto) {
                $pair = Pair::where('coin_symbol', $crypto['symbol'])->first();

                $cur_spot = Spot::where('pair_id', $pair->id)
                    ->orderBy('created_at', 'desc')
                    ->first();

                $new_spot = $crypto['quote']['USD']['price'];

                // $spot should NEVER be null
                // new spot value should NEVER be null or 0
                if(!$cur_spot || !$new_spot || $new_spot == 0) throw new Error();

                // If we are the same day, we update the latest spot value
                if (date('D', $ts) == date('D', $cur_spot->created_at)) {
                    $createdSpot = Spot::updateOrCreate(['created_at' => $cur_spot->created_at],
                    [
                        'current_value' => $new_spot,
                        // We don't multiply the return by 100 because these are the daily returns
                        // which are used for volatility computation => this avoids multiple division 
                        // by 100
                        'daily_return' => ($new_spot / $cur_spot->prev_value - 1),
                    ]);
                } else {
                    // If we are not the same day, basically tomorrow, we create a new record
                    $createdSpot = Spot::create([
                        'pair_id' => $pair->id,
                        'prev_value' => $new_spot,
                        'current_value' => $new_spot,
                        'daily_return' => 0,
                    ]);
                }

                // Eagerly load the 'pair' relationship
                $createdSpot->load('pair');
                $createdSpots[] = $createdSpot;
            }
        }
    }

    public function getLatestSpotFilteredByPairFormat($coin_symbol, $counter_symbol)
    {
        return Spot::join('pairs', 'spot.pair_id', '=', 'pairs.id')
            ->where('pairs.coin_symbol', $coin_symbol)
            ->where('pairs.counter_symbol', $counter_symbol)
            ->orderBy('spot.created_at', 'desc')
            ->first();
    }
}
