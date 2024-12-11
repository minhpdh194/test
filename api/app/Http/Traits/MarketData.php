<?php

namespace App\Http\Traits;

use App\Models\MarketData\Pair;
use App\Models\MarketData\Spot;
use App\Models\MarketData\Volatility;
use App\Services\MarketDataService;
use App\Utils\MathUtil;
use App\Utils\ToolsUtil;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use DateTimeZone;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Pusher\Pusher;

trait MarketData
{
    private static $ticks = array(
        "BTC" => 500,
        "ETH" => 25,
        "BNB" => 5,
        //Below is temp variable
        //SOL,XRP,LINK,UNI
        "SOL" => 4,
        "XRP" => 3,
        "LINK" => 2,
        "UNI" => 1,
        // "TON" => 10,
    );

    private $math;
    private $tools;
    private $marketDataService;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(MathUtil $math, ToolsUtil $tools, MarketDataService $marketDataService)
    {
        $this->math = $math;
        $this->tools = $tools;
        $this->marketDataService = $marketDataService;
    }

    public function getSpotsFromMarket()
    {
        $apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
        // $usdComparedSpots = $this->marketDataService->pairCoin($apiUrl, 'BTC,ETH,BNB,SOL,LINK,UNI,TON,XRP', 'USD');
        $this->marketDataService->pairCoin($apiUrl, 'BTC,ETH,BNB,SOL,LINK,UNI,XRP', 'USD');
    }

    public function getYieldsAndVolatilitiesFromMarket()
    {
        $ts = now();$this->getSpotsFromMarket();
        $yields = [];
        $expiry_date_options = $this->math->getOptionDateExpiry();
        $expiry_options = strtoupper(date_format($expiry_date_options, "dMy"));

        // We need to confirm whether we want Perp price, or if we use Deribit underlying price for BNB Yield
        $perps_symbols = [
            'BTC' => "BTC_USDC-PERPETUAL",
            'ETH' => "ETH_USDC-PERPETUAL",
            'BNB' => "BNB_USDC-PERPETUAL",
            'SOL' => "SOL_USDC-PERPETUAL",
            'XRP' => "XRP_USDC-PERPETUAL",
            'LINK' => "LINK_USDC-PERPETUAL",
            'UNI' => "UNI_USDC-PERPETUAL",
            // 'TON' => "TON_USDC-PERPETUAL",
        ];
        $options_symbols = [
            'BTC' => $this->getOptionSymbol('BTC', 'BTC_USDC', $expiry_options),
            'ETH' => $this->getOptionSymbol('ETH', 'ETH_USDC', $expiry_options),
            'BNB' => $this->getOptionSymbol('BNB', 'BNB_USDC', $expiry_options),
            'SOL' => $this->getOptionSymbol('SOL', 'SOL_USDC', $expiry_options),
            'XRP' => $this->getOptionSymbol('XRP', 'XRP_USDC', $expiry_options),
            'LINK' => $this->getOptionSymbol('LINK', 'LINK_USDC', $expiry_options),
            'UNI' => $this->getOptionSymbol('UNI', 'UNI_USDC', $expiry_options),
            // 'TON' => $this->getOptionSymbol('TON', 'TON_USDC', $expiry_options),
        ];

        // $url = 'https://www.deribit.com/api/v2';
        $reqId = 0;

        for ($i = 0; $i < count($perps_symbols); $i++) {
            $coin = array_keys($perps_symbols)[$i];
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

            // Why there is no referential??? What is the format used for pair_symbol???
            // $spot = Spot::where('pair_symbol', $this->tools->getPairSymbol($coin, "USD"))->first();
            // $spot = Spot::where('pair_symbol', $coin)->first();
            $spot = $this->marketDataService->getLatestSpotFilteredByPairFormat($coin, 'USD');
            $yields[$coin] = ($perp_price / $spot['value'] - 1.0) / $expiry;
        }

        for ($i = 0; $i < count($options_symbols); $i++) {
            $coin = array_keys($perps_symbols)[$i];
            $spot = $this->marketDataService->getLatestSpotFilteredByPairFormat($coin, 'USD');
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
                $fwd = $spot['value'] * (1.0 + $option_expiry * $yields[$coin]);
            } else {
                $option_expiry = $this->math->getOptionExpiryYF($now, $expiry_date_options);
                if (isset($data['result'])) {
                    $fwd = $data['result']['underlying_price'];
                }
                $yield = ($fwd / $spot['value'] - 1.0) / $option_expiry;
            }

            $fwd = round($fwd, 5);
            // Here, we override the vol and yield data since we don't need historical information
            $attributes = [
                'pair_id' => $spot->pair_id,
            ];

            if ($vol != 0) {
                $values = [
                    'yield' => $yield,
                    'forward' => $fwd,
                    'volatility' => $vol,
                    'timestamp' => $ts,
                ];
            } else {
                $values = [
                    'yield' => $yield,
                    'forward' => $fwd,
                    'timestamp' => $ts,
                ];
            }

            Volatility::updateOrCreate($attributes, $values);

            // $res[$spot]['fwd'] = $fwd;
            // $res[$spot]['volatility'] = $vol;

            $reqId++;
        }
    }

    public function getCorrelatedParameters($ts)
    {
        $ref_volsAndYields = null;
        $res = null;

        $ref_symbols = ['ETH', 'BTC', 'BNB'];
        // We replace by pairs since we will have cross pairs, like BTC/ETH
        $correlated_pairs = [$this->tools->getPairSymbol('SOL', 'USD'), $this->tools->getPairSymbol('XRP', 'USD')];
        $n = 30;

        $return_matrix = null;
        $count = 0;

        foreach ($ref_symbols as $ref_symbol) {
            $pair = $this->tools->getPairSymbol($ref_symbol, "USD");
            // We get the last n elements; last means the latest timestamped market data
            $spots = Spot::where('pair_symbol', $pair)->last($n)
                ->orderBy('timestamp', 'asc');

            // We fill in a column of returns for ref_symbol
            $ret_i = 0;
            foreach ($spots as $spot) {
                $return_matrix[$ret_i][$count] = $spot['return'];
                $ret_i++;
            }

            $ref_volsAndYields[$ref_symbol] = Volatility::where('pair_symbol', $pair)->first();
            $count++;
        }

        $svd_res = $this->math->solve($return_matrix, count($ref_symbols));

        $crypto = [];
        foreach ($correlated_pairs as $pair) {
            $spots = Spot::where('pair_symbol', $pair)->last($n)
                ->orderBy('timestamp', 'asc');

            $target_returns = $spots->select['return'];
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

            Volatility::updateOrCreate(
                ['pair_symbol' => $pair],
                [
                    'yield' => $yield,
                    'forward' => $fwd,
                    'volatility' => $vol,
                    'timestamp' => $ts
                ]
            );

            $res[$pair]['fwd'] = $fwd;
            $res[$pair]['vol'] = $vol;
        }

        return $res;
    }

    public function integration()
    {
        $ts = now();
        $ticks = self::$ticks;
        $this->getYieldsAndVolatilitiesFromMarket();
        $createdSpots =  Spot::with('pair')
            ->orderBy('created_at', 'desc')
            ->limit(count($ticks))
            ->get();
        for ($i = 0; $i < count($ticks); $i++) {
            $volatility = Volatility::where('pair_id', $createdSpots[$i]->pair->id)->first();
            if ($volatility) {
                $old_value = $createdSpots[$i]->value;
                $new_value = $volatility->forward;

                if ($old_value != 0) {
                    $percent_change = (($new_value - $old_value) / $old_value) * 100;
                } else {
                    $percent_change = null;
                }
                
                $createdSpots[$i]->update([
                    'value' => $volatility->forward,
                    'return' => $percent_change,
                    'timestamp' => $ts,
                ]);
            }
        }
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
            Log::info('test pusher', ['result' => $createdSpots]);
        } catch (\Throwable $e) {
            $notify[] = ['warning', 'Pusher Not Properly Set'];
            Log::info('error pusher', ['error' => $e->getMessage()]);
        }
        return response()->json($createdSpots);
    }

    private function getOptionSymbol($coin, $opt_symb, $expiry)
    {
        $ticks = self::$ticks;
        $tick = $ticks[$coin];
        // $spot = Spot::join('pairs', 'spot.pair_id', '=', 'pairs.id')
        //     ->where('pairs.coin_symbol', $coin)->orderBy('spot.created_at', 'desc')->first()->value;
        $counter_symbol = 'USD'; //temporarity fix value
        $spot = $this->marketDataService->getLatestSpotFilteredByPairFormat($coin, $counter_symbol);
        // $spot = $spot = Spot::where('pair_symbol', $coin)->first()->value;
        $value = $spot->value;
        $strike = floor($value / $tick) * $tick;
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
