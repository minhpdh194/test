<?php

namespace App\ServerTasks;

use DateTimeZone;
use Http;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Pusher\Pusher;

use App\Models\MarketData\Spot;
use App\Models\MarketData\Pair;
use App\Models\MarketData\VolAndFwd;
use App\Models\MarketData\Fixing;
use App\Models\MarketData\Index;
use App\Models\MarketData\TotalOpenPositionValue;
use App\Models\Settings;
use App\Services\MarketDataService;
use App\Utils\MathUtil;
use App\Utils\ToolsUtil;
use Exception;

class MarketDataTasks
{
    private static $ticks = array(
        "BTC" => 500,
        "ETH" => 25,
        "BNB" => 5,
        "SOL" => 2
    );

    private $marketDataService;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(MarketDataService $marketDataService)
    {
        $this->marketDataService = $marketDataService;
    }

    public function getSpotsFromMarket($pairs)
    {
        $list_of_coins = 'BTC,ETH,BNB,SOL';
        // foreach ($pairs as $pair) { $list_of_coins = $list_of_coins . ($list_of_coins !== '' ? ',' : '') . $pair->coin_symbol; }

        $apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
        // $usdComparedSpots = $this->marketDataService->pairCoin($apiUrl, 'BTC,ETH,BNB,SOL,LINK,UNI,TON,XRP', 'USD');
        $usdComparedSpots = $this->marketDataService->pairCoin($apiUrl, $list_of_coins, 'USD');
        return $usdComparedSpots['data'];
    }

    public function storeSpots($pairs)
    {
        $createdSpots = [];
        $crypto_data = $this->getSpotsFromMarket($pairs);
        foreach ($pairs as $pair) {
            try {
                $createdSpot = $this->marketDataService->updateOrCreateSpotData($crypto_data[$pair->coin_symbol], $pair, $crypto_data[$pair->coin_symbol]['quote']['USD']['price']);
                if ($createdSpot) {
                    $createdSpots[$pair->coin_symbol] = $createdSpot;
                }
            } catch (Exception $e) {
                \Log::info($e);
            }
        }

        return $createdSpots;
    }

    public function getYieldsAndVolatilitiesFromMarket($createdSpots)
    {
        $yields = [];
        $expiry_date_options = MathUtil::getOptionDateExpiry();
        $expiry_options = strtoupper(date_format($expiry_date_options, "dMy"));

        // We need to confirm whether we want Perp price, or if we use Deribit underlying price for BNB | SOL Yields
        $perps_symbols = [
            'BNB' => "BNB_USDC-PERPETUAL",
            'SOL' => "SOL_USDC-PERPETUAL",
        ];
        $options_symbols = [
            'BTC' => $this->getOptionSymbol('BTC', 'BTC', $expiry_options, $createdSpots['BTC']->current_value),
            'ETH' => $this->getOptionSymbol('ETH', 'ETH', $expiry_options, $createdSpots['ETH']->current_value),
            'BNB' => $this->getOptionSymbol('BNB', 'BNB_USDC', $expiry_options, $createdSpots['BNB']->current_value),
            'SOL' => $this->getOptionSymbol('SOL', 'SOL_USDC', $expiry_options, $createdSpots['SOL']->current_value),
        ];

        // $url = 'https://www.deribit.com/api/v2';
        for ($i = 0; $i < count($perps_symbols); $i++) {
            $coin = array_keys($perps_symbols)[$i];
            $pair = Pair::select('id', 'pair_symbol', 'coin_symbol')->where('pair_symbol', ToolsUtil::getPairSymbol($coin, 'USD'))->first();

            $url = 'https://www.deribit.com/api/v2/public/get_order_book?instrument_name=' . array_values($perps_symbols)[$i] . '&depth=' . '1';

            // Send the request to Deribit API
            $response = Http::withHeaders(['Content-Type' => 'application/json'])->get($url);
            $expiry = MathUtil::getPerpExpiryYF();
            $data = $response->json();
            $perp_result = $data['result'];
            $perp_price = 0.5 * ($perp_result['best_bid_price'] + $perp_result['best_ask_price']);

            $new_spot_value = $createdSpots[$pair->coin_symbol]->current_value;
            $yields[$coin] = ($perp_price / $new_spot_value - 1.0) / $expiry;
        }

        $now = date_create('now', new DateTimeZone('UTC'));
        $option_expiry = MathUtil::getOptionExpiryYF($now, $expiry_date_options);

        for ($i = 0; $i < count($options_symbols); $i++) {
            $coin = array_keys($options_symbols)[$i];
            $pair = Pair::select('id', 'pair_symbol', 'coin_symbol')->where('pair_symbol', ToolsUtil::getPairSymbol($coin, 'USD'))->first();

            $url = 'https://www.deribit.com/api/v2/public/get_order_book?instrument_name=' . array_values($options_symbols)[$i] . '&depth=' . '1';

            // Send the request to Deribit API
            $response = Http::withHeaders(['Content-Type' => 'application/json'])->get($url);
            $data = $response->json();

            $vol = 0;
            if (isset($data['result'])) {
                $vol = $data['result']['mark_iv'] / 100.0;
            }

            $yield = 0.0;
            $fwd = 0.0;
            $new_spot_value = $createdSpots[$pair->coin_symbol]->current_value;

            if (array_key_exists($coin, $yields)) {
                $yield = $yields[$coin];
                $fwd = $new_spot_value * (1.0 + $option_expiry * $yields[$coin]);
            } else {
                if (isset($data['result'])) {
                    $fwd = $data['result']['underlying_price'];
                }
                $yield = ($fwd / $new_spot_value - 1.0) / $option_expiry;
            }

            $fwd = round($fwd, 5);

            // Here, we override the vol and yield data since we don't need historical information
            VolAndFwd::updateOrCreate(
                [
                    'pair_id' => $pair->id,
                ],
                [
                    'yield' => $yield,
                    'forward' => $fwd,
                    'volatility' => $vol
                ]
            );
        }

        return $option_expiry;
    }

    public function getCorrelatedParameters($pairs)
    {
        $ref_volsAndYields = null;

        $ref_symbols = ['ETH', 'BTC', 'BNB', 'SOL'];
        // We replace by pairs since we will have cross pairs, like BTC/ETH
        $correlated_pairs = [];

        foreach ($pairs as $pair) {
            if (in_array($pair->coin_symbol, $ref_symbols)) continue;
            $correlated_pairs[] = ToolsUtil::getPairSymbol($pair->coin_symbol, 'USD');
        }

        $n = 30;

        $return_matrix = null;
        $count = 0;

        foreach ($ref_symbols as $ref_symbol) {
            $pair = Pair::select('id', 'pair_symbol')->where('pair_symbol', ToolsUtil::getPairSymbol($ref_symbol, "USD"))->first();
            // We get the last n elements; last means the latest timestamped market data
            $spots = Spot::where('pair_id', $pair->id)
                ->orderBy('created_at', 'asc')
                ->take($n)
                ->get();

            // We fill in a column of returns for ref_symbol
            $ret_i = 0;
            foreach ($spots as $spot) {
                $return_matrix[$ret_i][$count] = $spot->daily_return;
                $ret_i++;
            }

            $ref_volsAndYields[$ref_symbol] = VolAndFwd::where('pair_id', $pair->id)->first();
            $count++;
        }

        $svd_res = MathUtil::solve($return_matrix, $ref_symbols);

        $crypto = [];
        foreach ($correlated_pairs as $correlated_pair) {
            $pair = Pair::select('id', 'pair_symbol')->where('pair_symbol', $correlated_pair)->first();
            $spots = Spot::where('pair_id', $pair->id)
                ->orderBy('created_at', 'asc')
                ->take($n);

            // IS IT SELECTING THE ARRAY OF DAILY RETURNS?
            $target_returns = $spots->pluck('daily_return');
            $err = MathUtil::getError($return_matrix, $target_returns, $svd_res);

            $vol = 0.0;
            $yield = 0.0;

            for ($i = 0; $i < count($ref_symbols); $i++) {
                $f = $svd_res[$i] * $ref_volsAndYields[$ref_symbols[$i]]['volatility'];
                $vol += $f * $f;
                $yield += $svd_res[$i] * $ref_volsAndYields[$ref_symbols[$i]]['yield'];
            }

            // We have stored yield as Yield(p.a.) * expiry
            $fwd = $spots * (1.0 + $yield);
            $vol = sqrt($vol) + $err;

            VolAndFwd::updateOrCreate(
                ['pair_id' => $pair->id],
                [
                    'yield' => $yield,
                    'forward' => $fwd,
                    'volatility' => $vol,
                ]
            );
        }
    }

    public function computeFixings($pairs, $T)
    {
        $dt = 1.0 / ($T * 262800);
        $indices_perf = [];
        $mult = (float)Settings::where('name', 'prem_mult')->first();
        $timestamp = ToolsUtil::getFixingTimestamp();

        foreach ($pairs as $pair) {
            $vol_fwd = VolAndFwd::where(['pair_id' => $pair->id])->first();
            $spot = Spot::where('pair_id', $pair->id)->orderBy('created_at', 'desc')->first();
            $premium = 0.0;

            $prev_long_index = Index::where(['pair_id' => $pair->id, 'long_short' => 'long'])
                ->orderBy('created_at', 'desc')
                ->first();
            $prev_short_index = Index::where(['pair_id' => $pair->id, 'long_short' => 'short'])
                ->orderBy('created_at', 'desc')
                ->first();

            $total_positions = TotalOpenPositionValue::where('pair_id', $pair->id)->first();

            if ($spot->current_value > $spot->prev_value) {
                $call = MathUtil::call($T, $spot->prev_value, $spot->current_value, $vol_fwd->yield, $vol_fwd->volatility);
                $premium = $call / $spot->prev_value * $mult * $dt;

                $longPerf = Index::updateOrCreate(['pair_id' => $pair->id], [
                    'long_short' => 'long',
                    'value' => $prev_long_index ? $prev_long_index->value : 0
                        + $premium * max(
                            1,
                            ($total_positions ? $total_positions->total_short_value : 0) /
                                ($total_positions ? $total_positions->total_short_value : 1)
                        ),
                    'timestamp' => $timestamp
                ]);

                $shortPerf = Index::updateOrCreate(['pair_id' => $pair->id], [
                    'long_short' => 'short',
                    'value' => $prev_short_index ? $prev_short_index->value : 0 - $premium,
                    'timestamp' => $timestamp
                ]);

                $indices_perf[$pair->coin_symbol] = [
                    'long' => ($longPerf ? $longPerf->value : 0) - ($prev_long_index ? $prev_long_index->value : 0),
                    'short' => -$premium,
                    'time' => $timestamp
                ];
            } else if ($spot->current_value < $spot->prev_value) {
                $put = MathUtil::put($T, $spot->prev_value, $spot->current_value, $vol_fwd->yield, $vol_fwd->volatility);
                $premium = $put / $spot->prev_value * $mult * $dt;

                $longPerf = Index::updateOrCreate(['pair_id' => $pair->id], [
                    'long_short' => 'long',
                    'value' => $prev_long_index ? $prev_long_index->value : 0 - $premium,
                    'timestamp' => $timestamp
                ]);

                $shortPerf = Index::updateOrCreate(['pair_id' => $pair->id], [
                    'long_short' => 'short',
                    'value' => $prev_short_index ? $prev_short_index->value : 0 + $premium * max(
                        1,
                        ($total_positions ? $total_positions->total_long_value : 0) / ($total_positions ? $total_positions->total_short_value : 1)
                    ),
                    'timestamp' => $timestamp
                ]);

                $indices_perf[$pair->coin_symbol] = [
                    'long' => -$premium,
                    'short' => $shortPerf->value - ($prev_short_index ? $prev_short_index->value : 0),
                    'time' => $timestamp
                ];
            } else {
                $longPerf = Index::updateOrCreate(['pair_id' => $pair->id], [
                    'long_short' => 'long',
                    'value' => $prev_long_index ? $prev_long_index->value : 0,
                    'timestamp' => $timestamp
                ]);

                $shortPerf = Index::updateOrCreate(['pair_id' => $pair->id], [
                    'long_short' => 'short',
                    'value' => $prev_short_index ? $prev_short_index->value : 0,
                    'timestamp' => $timestamp
                ]);

                $indices_perf[$pair->coin_symbol] = [
                    'long' => 0,
                    'short' => 0,
                    'time' => $timestamp
                ];
            }

            if ($premium) {
                $fixing = Fixing::updateOrCreate(['pair_id' => $pair->id], [
                    'prev_spot' => $spot->prev_value,
                    'spot' => $spot->current_value,
                    'forward' => $vol_fwd->forward,
                    'option_premium' => $premium
                ]);
            }
        }

        return $indices_perf;
    }

    public function integration()
    {
        $pairs = Pair::limit(4)->get(); //get first 4 rows;

        $createdSpots = $this->storeSpots($pairs);
        $T = $this->getYieldsAndVolatilitiesFromMarket($createdSpots);
        $this->getCorrelatedParameters($pairs);
        $indices_perf = $this->computeFixings($pairs, $T);

        $options = array(
            'cluster' => 'ap2',
            'useTLS' => true
        );

        $pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            $options
        );

        try {
            $pusher->trigger('pairs', 'data', ['pairs' => $createdSpots]);
            \Log::info('test pusher', ['result' => $createdSpots]);

            $pusher->trigger('perfs', 'data', ['perfs' => $indices_perf]);
            \Log::info('test pusher', ['result' => $indices_perf]);
        } catch (\Throwable $e) {
            $notify[] = ['warning', 'Pusher Not Properly Set'];
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }
        return response()->json($createdSpots);
    }

    private function getOptionSymbol($coin, $opt_symb, $expiry, $new_spot_value)
    {
        $ticks = self::$ticks;
        $tick = $ticks[$coin];
        $pair = Pair::where('coin_symbol', $coin)->first();
        // $spot = Spot::where('pair_id', $pair->id)->first()->current_value;
        \Log::info($new_spot_value);
        $strike = floor($new_spot_value / $tick) * $tick;
        return sprintf("%s-%s-%s-P", $opt_symb, $expiry, $strike);
    }

    // returns the expiry date as well as the number of days to expiry
    private function getExpiryFutures($date_utc)
    {
        $day_offset = 5 - date_format($date_utc, "w");
        if ($day_offset < 0)
            $day_offset += 7;
        $today_utc = Carbon::today();
        $next_friday_expiry = date_add($today_utc, date_interval_create_from_date_string("{$day_offset} days"));

        return [strtoupper(date_format($next_friday_expiry, "dMy")), $day_offset];
    }
}
