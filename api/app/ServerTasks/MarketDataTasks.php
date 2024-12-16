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
use App\Services\MarketDataService;
use App\Utils\MathUtil;
use App\Utils\ToolsUtil;

class MarketDataTasks
{
    private static $ticks = array(
        "BTC" => 500,
        "ETH" => 25,
        "BNB" => 5,
        "SOL" => 1
    );

    private $math;
    private $marketDataService;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(MathUtil $math, MarketDataService $marketDataService)
    {
        $this->math = $math;
        $this->marketDataService = $marketDataService;
    }

    public function getSpotsFromMarket()
    {
        $apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
        // $usdComparedSpots = $this->marketDataService->pairCoin($apiUrl, 'BTC,ETH,BNB,SOL,LINK,UNI,TON,XRP', 'USD');
        $usdComparedSpots = $this->marketDataService->pairCoin($apiUrl, 'BTC,ETH,BNB,SOL,LINK,UNI,XRP', 'USD');
        return $usdComparedSpots;
    }

    public function getYieldsAndVolatilitiesFromMarket()
    {
        $ts = now();
        // IF WE DON'T USE THE CREATED SPOTS, SHOULD IT BE KEPT HERE?
        $createdSpots = $this->getSpotsFromMarket();
        $yields = [];
        $expiry_date_options = $this->math->getOptionDateExpiry();
        $expiry_options = strtoupper(date_format($expiry_date_options, "dMy"));

        // We need to confirm whether we want Perp price, or if we use Deribit underlying price for BNB | SOL Yields
        $perps_symbols = [
            // 'BTC' => "BTC_USDC-PERPETUAL",
            // 'ETH' => "ETH_USDC-PERPETUAL",
            'BNB' => "BNB_USDC-PERPETUAL",
            'SOL' => "SOL_USDC-PERPETUAL",
        ];
        $options_symbols = [
            'BTC' => $this->getOptionSymbol('BTC', 'BTC', $expiry_options),
            'ETH' => $this->getOptionSymbol('ETH', 'ETH', $expiry_options),
            'BNB' => $this->getOptionSymbol('BNB', 'BNB_USDC', $expiry_options),
            'SOL' => $this->getOptionSymbol('SOL', 'SOL_USDC', $expiry_options),
            // 'TON' => $this->getOptionSymbol('TON', 'TON_USDC', $expiry_options),
        ];

        // $url = 'https://www.deribit.com/api/v2';
        $reqId = 0;
        $collection = collect($createdSpots);

        for ($i = 0; $i < count($perps_symbols); $i++) {
            $coin = array_keys($perps_symbols)[$i];
            $pair = Pair::select('id', 'pair_symbol')->where('pair_symbol', ToolsUtil::getPairSymbol($coin, 'USD'))->first();

            $url = 'https://www.deribit.com/api/v2/public/get_order_book?instrument_name=' . array_values($perps_symbols)[$i] . '&depth=' . '1';
            // We define the parameters for the get request
            // Parameters for futures
            // $parameters = [
            //     'jsonrpc' => '2.0',
            //     'id' => $reqId,
            //     'method' => 'public/get_order_book',
            //     "params" => [
            //         "instrument_name" => array_values($perps_symbols)[$i],
            //         "depth" => 1
            //     ]
            // ];

            // Send the request to Deribit API
            // $response = Http::withHeaders(['Content-Type' => 'application/json'])->get($url, $parameters);
            $response = Http::withHeaders(['Content-Type' => 'application/json'])->get($url);
            $expiry = $this->math->getPerpExpiryYF();
            $data = $response->json();
            $perp_result = $data['result'];
            $perp_price = 0.5 * ($perp_result['best_bid_price'] + $perp_result['best_ask_price']);

            // SHOULDN'T WE USE THE $createdSpots to avoid a call to the database??
            // $spot = Spot::where('pair_id', $pair->id)->sortByDesc('created_at')->first();
            $spot = $collection->firstWhere('pair_id', $pair->id);
            $yields[$coin] = ($perp_price / $spot->current_value - 1.0) / $expiry;
        }

        for ($i = 0; $i < count($options_symbols); $i++) {
            $coin = array_keys($options_symbols)[$i];
            $pair = Pair::select('id', 'pair_symbol')->where('pair_symbol', ToolsUtil::getPairSymbol($coin, 'USD'))->first();

            // SHOULDN'T WE USE THE $createdSpots to avoid a call to the database??
            $spot = $collection->firstWhere('pair_id', $pair->id);

            $url = 'https://www.deribit.com/api/v2/public/get_order_book?instrument_name=' . array_values($options_symbols)[$i] . '&depth=' . '1';

            // We define the parameters for the get request
            // Parameters for options
            // $parameters = [
            //     'jsonrpc' => '2.0',
            //     'id' => $reqId,
            //     'method' => 'public/get_order_book',
            //     "params" => [
            //         "instrument_name" => array_values($options_symbols)[$i],
            //         "depth" => 1
            //     ]
            // ];

            // Send the request to Deribit API
            $response = Http::withHeaders(['Content-Type' => 'application/json'])->get($url);
            $now = date_create('now', new DateTimeZone('UTC'));
            $data = $response->json();

            $vol = 0;
            if (isset($data['result'])) {
                $vol = $data['result']['mark_iv'] / 100.0;
            }
            
            $yield = 0.0;
            $fwd = 0.0;

            if (array_key_exists($coin, $perps_symbols)) {
                $option_expiry = $this->math->getOptionExpiryYF($now, $expiry_date_options);
                $yield = $yields[$coin];
                $fwd = $spot->current_value * (1.0 + $option_expiry * $yields[$coin]);
            } else {
                $option_expiry = $this->math->getOptionExpiryYF($now, $expiry_date_options);
                if (isset($data['result'])) {
                    $fwd = $data['result']['underlying_price'];
                }
                $yield = ($fwd / $spot->current_value - 1.0) / $option_expiry;
            }

            $fwd = round($fwd, 5);
            // Here, we override the vol and yield data since we don't need historical information

            if ($fwd > 0) {
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


            // $res[$pair]['fwd'] = $fwd;
            // $res[$pair]['volatility'] = $vol;

            $reqId++;
        }

        return $createdSpots;
    }

    public function getCorrelatedParameters($ts)
    {
        $ref_volsAndYields = null;
        $res = null;

        $ref_symbols = ['ETH', 'BTC', 'BNB', 'SOL'];
        // We replace by pairs since we will have cross pairs, like BTC/ETH
        $correlated_pairs = [
            ToolsUtil::getPairSymbol('XRP', 'USD'),
            ToolsUtil::getPairSymbol('UNI', 'USD'),
            ToolsUtil::getPairSymbol('UNI', 'USD'),
            ToolsUtil::getPairSymbol('UNI', 'USD'),
        ];
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

        $svd_res = $this->math->solve($return_matrix, count($ref_symbols));

        $crypto = [];
        foreach ($correlated_pairs as $correlated_pair) {
            $pair = Pair::select('id', 'pair_symbol')->where('pair_symbol', $correlated_pair)->first();
            $spots = Spot::where('pair_id', $pair->id)
                ->orderBy('created_at', 'asc')
                ->take($n)
                ->get();

            // IS IT SELECTING THE ARRAY OF DAILY RETURNS?
            $target_returns = $spots->select['daily_return'];
            $err = $this->math->getError($return_matrix, $target_returns, $svd_res);

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

            $res[$pair]['fwd'] = $fwd;
            $res[$pair]['vol'] = $vol;
        }

        return $res;
    }

    public function integration()
    {
        $createdSpots = $this->getYieldsAndVolatilitiesFromMarket();
        // $correlatedVolsAndFwds = $this->getCorrelatedParameters($ts);
        // $spots = Spot::with('volatility')->orderBy('created_at', 'desc')->limit(count($createdSpots))->get();
        $returnedSpots = [];
        // foreach ($createdSpots as $spot) {
        //     $volatility = VolAndFwd::where('pair_id', $spot->pair_id)->first();
        //     if ($volatility) {
        //         $old_value = $spot->value;
        //         $new_value = $volatility->forward;

        //         if ($old_value != 0) {
        //             $percent_change = (($new_value - $old_value) / $old_value);
        //         } else {
        //             $percent_change = 0;
        //         }

        //         $spot->update([
        //             // 'pair_symbol' => $volatility->pair_symbol,
        //             'current_value' => (string)$volatility->forward,
        //             'daily_return' => $percent_change,
        //             // 'base_symbol' => $volatility->base_symbol,
        //         ]);
        //         $returnedSpots[] = $spot;
        //     }
        // }
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
        } catch (\Throwable $e) {
            $notify[] = ['warning', 'Pusher Not Properly Set'];
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }
        return response()->json($createdSpots);
    }

    private function getOptionSymbol($coin, $opt_symb, $expiry)
    {
        $ticks = self::$ticks;
        $tick = $ticks[$coin];
        $pair = Pair::where('coin_symbol', $coin)->first();
        $spot = Spot::where('pair_id', $pair->id)->first()->current_value;
        $strike = floor($spot / $tick) * $tick;
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
