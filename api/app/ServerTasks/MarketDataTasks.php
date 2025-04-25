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
use App\Models\MarketData\Ticks;
use App\Models\MarketData\TotalOpenPositionValue;
use App\Models\Settings;
use App\Services\MarketDataService;
use App\Utils\MathUtil;
use App\Utils\ToolsUtil;

class MarketDataTasks
{
    private $marketDataService;
    private $hasHisto;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(MarketDataService $marketDataService)
    {
        $this->marketDataService = $marketDataService;
        $this->hasHisto = [];

        $natural_pairs = Pair::where('counter_symbol', 'USD')->get();

        $now = date_create('NOW', new DateTimeZone('UTC'));
        date_add($now, date_interval_create_from_date_string("-1 day"));
        $time_end = date_format($now, "Y-m-d") . 'T23:59:00.000Z';

        foreach ($natural_pairs as $pair) {
            if ($pair->histo_init == false) {
                $histo_spots = $this->getHistoricalSpots($pair, $time_end, 30);
                $pair->histo_init = true;
                $pair->save();
            }

            $this->hasHisto[$pair->pair_symbol] = true;
        }
    }

    public function getSpotsFromMarket($pairs)
    {
        $list_of_coins = '';
        foreach ($pairs as $pair) {
            $list_of_coins = $list_of_coins . ($list_of_coins !== '' ? ',' : '') . $pair->cmc_id;
        }

        $apiUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';
        // $usdComparedSpots = $this->marketDataService->pairCoin($apiUrl, 'BTC,ETH,BNB,SOL,LINK,UNI,TON,XRP', 'USD');
        $usdComparedSpots = $this->marketDataService->pairCoin($apiUrl, $list_of_coins, 'USD');
        return $usdComparedSpots['data'];
    }

    public function getHistoricalSpots($pair, $yesterday, $n)
    {
        $apiUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical';
        $rawUsdHistoSpots = $this->marketDataService->getHistoPrices($apiUrl, $pair, $yesterday, 'USD', $n);
        $quotes = $rawUsdHistoSpots['data']['quotes'];

        $prev_value = 0;
        $return = 0;

        foreach ($quotes as $quote) {
            $price = $quote['quote']['USD']['price'];
            if ($prev_value != 0)
                $return = ($price / $prev_value - 1.0);

            Spot::create([
                'pair_id' => $pair->id,
                'fixing_period' => 12,
                'day_open_value' => $prev_value,
                'period_open_value' => 0,
                'prev_value' => $prev_value,
                'current_value' => $price,
                'period_return' => $return,
                'daily_return' => $return,
                'created_at' => $quote['quote']['USD']['timestamp'],
                'updated_at' => $quote['quote']['USD']['timestamp']
            ]);

            $prev_value = $price;
        }
    }

    public function storeSpots($pairs, $now)
    {
        $createdSpots = [];
        $crypto_data = $this->getSpotsFromMarket($pairs);

        foreach ($pairs as $pair) {
            $createdSpot = $this->marketDataService->updateOrCreateSpotData($pair, $crypto_data[$pair->cmc_id]['quote']['USD']['price'], $now);
            if ($createdSpot) {
                $createdSpots[$pair->coin_symbol] = $createdSpot;
            }
        }

        return $createdSpots;
    }

    public function getYieldsAndVolatilitiesFromMarket($createdSpots)
    {
        $yields = [];
        $expiry_date_options = MathUtil::getOptionDateExpiry();
        $expiry_options = ToolsUtil::getDeribitOptionName($expiry_date_options);

        // We don't use perps... it gives weird yields
        $perps_symbols = [
            //'BNB' => "BNB_USDC-PERPETUAL",
            //'SOL' => "SOL_USDC-PERPETUAL",
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

            $vol = 0;
            $yield = 0.0;
            $fwd = 0.0;
            $data = [];

            try {
                $url = 'https://www.deribit.com/api/v2/public/get_order_book?instrument_name=' . array_values($options_symbols)[$i] . '&depth=' . '1';
                $response = Http::withHeaders(['Content-Type' => 'application/json'])->get($url);
                $data = $response->json();
            } catch (\Exception $e) {
                \Log::info('error getting data from Deribit API', ['error' => $e->getMessage()]);
            }

            $last = VolAndFwd::where('pair_id', $pair->id)->first();

            if (isset($data['result'])) {
                $vol = $data['result']['mark_iv'] / 100.0;

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

                if ($vol < 0.05 || $yield > 1) {
                    if (!$last)
                        throw new \Exception('VolAndFwd could not be initiated for ' . $coin);

                    $vol = $last->current_volatility;
                    $yield = $last->current_yield;
                    $fwd = $last->forward;
                }

                $fwd = round($fwd, 5);
            } else {
                if (!$last)
                    throw new \Exception('VolAndFwd could not be initiated for ' . $coin);

                $vol = $last->current_volatility;
                $yield = $last->current_yield;
                $fwd = $last->forward;
            }

            // Here, we override the vol and yield data since we don't need historical information
            VolAndFwd::updateOrCreate(
                [
                    'pair_id' => $pair->id,
                ],
                [
                    'prev_yield' => $last ? $last->current_yield : 0.0,
                    'current_yield' => $yield,
                    'forward' => $fwd,
                    'prev_volatility' => $last ? $last->current_volatility : 0.0,
                    'current_volatility' => $vol
                ]
            );
        }

        return $option_expiry;
    }

    public function getCorrelatedParameters($T, $pairs)
    {
        $ref_volsAndYields = null;

        $ref_symbols = ['ETH', 'BTC', 'BNB', 'SOL'];
        // We replace by pairs since we will have cross pairs, like BTC/ETH
        $correlated_pairs = [];

        foreach ($pairs as $pair) {
            if (in_array($pair->coin_symbol, $ref_symbols))
                continue;
            $correlated_pairs[] = $pair->pair_symbol;
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

        $crypto = [];
        foreach ($correlated_pairs as $correlated_pair) {
            $pair = Pair::select('id', 'pair_symbol')->where('pair_symbol', $correlated_pair)->first();
            $spots = Spot::where('pair_id', $pair->id)
                ->orderBy('created_at', 'asc')
                ->take($n);

            $last_spot = Spot::where('pair_id', $pair->id)
                ->orderBy('created_at', 'desc')
                ->first();

            // IS IT SELECTING THE ARRAY OF DAILY RETURNS?
            $target_returns = $spots->pluck('daily_return');
            $svd_res = MathUtil::solve($return_matrix, $target_returns);
            $err = MathUtil::getError($return_matrix, $target_returns, $svd_res);

            $vol = 0.0;
            $yield = 0.0;
            $norm = 0.0;

            for ($i = 0; $i < count($ref_symbols); $i++) {
                $vol_data = $ref_volsAndYields[$ref_symbols[$i]];
                $f = $svd_res[$i] * $vol_data->current_volatility;
                $vol += $f * $f;
                $yield += $svd_res[$i] * $vol_data->current_yield;
            }

            // We have stored yield as Yield(p.a.) * expiry
            $fwd = $last_spot->current_value * (1.0 + $yield * $T);
            $vol = max(sqrt($vol) + $err, 0.1);

            $last = VolAndFwd::where('pair_id', $pair->id)->first();

            VolAndFwd::updateOrCreate(
                ['pair_id' => $pair->id],
                [
                    'prev_yield' => $last ? $last->current_yield : 0.0,
                    'current_yield' => $yield,
                    'forward' => $fwd,
                    'prev_volatility' => $last ? $last->current_volatility : 0.0,
                    'current_volatility' => $vol
                ]
            );
        }
    }

    public function getXPairsParameters($xpairs, $T, $now)
    {
        $n = 30;

        foreach ($xpairs as $pair) {
            // Sanity check: we exclude USD pairs
            if ($pair->counter_symbol === 'USD')
                continue;

            $pair1 = Pair::where('pair_symbol', ToolsUtil::getPairSymbol($pair->coin_symbol, 'USD'))->first();
            $pair2 = Pair::where('pair_symbol', ToolsUtil::getPairSymbol($pair->counter_symbol, 'USD'))->first();

            $spots1 = Spot::where('pair_id', $pair1->id)
                ->orderBy('created_at', 'desc')
                ->take($n)
                ->get();

            $spots2 = Spot::where('pair_id', $pair2->id)
                ->orderBy('created_at', 'desc')
                ->take($n)
                ->get();

            $corr = MathUtil::computeCorrelation($spots1->pluck('daily_return')->toArray(), $spots2->pluck('daily_return')->toArray(), $n);
            $spot = $spots1->first()->current_value / $spots2->first()->current_value;

            $last = VolAndFwd::where('pair_id', $pair->id)->first();

            $vol_fwd1 = VolAndFwd::where('pair_id', $pair1->id)->first();
            $vol_fwd2 = VolAndFwd::where('pair_id', $pair2->id)->first();

            $fwd = $vol_fwd1->forward / $vol_fwd2->forward;
            $vol = sqrt($vol_fwd1->current_volatility * $vol_fwd1->current_volatility + $vol_fwd2->current_volatility * $vol_fwd2->current_volatility + 2.0 * $corr * $vol_fwd1->current_volatility * $vol_fwd2->current_volatility);

            $this->marketDataService->updateOrCreateSpotData($pair, $spot, $now);

            VolAndFwd::updateOrCreate(
                ['pair_id' => $pair->id],
                [
                    'prev_yield' => $last ? $last->current_yield : 0.0,
                    'current_yield' => ($fwd / $spot - 1.0) / $T,
                    'forward' => $fwd,
                    'prev_volatility' => $last ? $last->current_volatility : 0.0,
                    'current_volatility' => $vol,
                ]
            );
        }
    }

    public function computeFixings($pairs, $T)
    {
        $dt = 1.0 / 262800;
        $accrual = $dt / $T;

        $last_indices = [];
        $mult = (float) Settings::where('name', 'prem_mult')->first()->value;
        $timestamp = ToolsUtil::getFixingTimestamp();

        foreach ($pairs as $pair) {
            $vol_fwd = VolAndFwd::where(['pair_id' => $pair->id])->first();
            $spot = Spot::where('pair_id', $pair->id)->orderBy('updated_at', 'desc')->first();
            $premium = 0.0;

            $prev_long_index = Index::where(['pair_id' => $pair->id, 'long_short' => 'long'])
                ->orderBy('created_at', 'desc')
                ->first();

            $prev_short_index = Index::where(['pair_id' => $pair->id, 'long_short' => 'short'])
                ->orderBy('created_at', 'desc')
                ->first();

            $total_positions = TotalOpenPositionValue::where('pair_id', $pair->id)->first();
            $adj = 1;
            $histo = $prev_long_index->histo_record;

            if ($histo == 5) {
                $histo = 1;
            } else {
                $histo += 1;
            }

            if ($spot->current_value > $spot->prev_value) {
                $perf = MathUtil::yield($T, $dt, $spot->prev_value, $spot->current_value, $vol_fwd->prev_yield, $vol_fwd->prev_volatility, $vol_fwd->current_volatility, true);
                $premium = $perf * $mult * $accrual;

                if ($total_positions && $total_positions->total_long_value > 0) {
                    $adj = max(1, $total_positions->total_short_value / $total_positions->total_long_value);
                }

                $longPerf = Index::updateOrCreate(['pair_id' => $pair->id, 'long_short' => 'long', 'histo_record' => $histo], [
                    'value' => $prev_long_index->value + $premium * $adj,
                    'created_at' => $timestamp
                ]);

                $shortPerf = Index::updateOrCreate(['pair_id' => $pair->id, 'long_short' => 'short', 'histo_record' => $histo], [
                    'value' => $prev_short_index->value - $premium,
                    'created_at' => $timestamp
                ]);
            } else if ($spot->current_value < $spot->prev_value) {
                $perf = MathUtil::yield($T, $dt, $spot->prev_value, $spot->current_value, $vol_fwd->prev_yield, $vol_fwd->prev_volatility, $vol_fwd->current_volatility, false);
                $premium = $perf * $mult * $accrual;

                $longPerf = Index::updateOrCreate(['pair_id' => $pair->id, 'long_short' => 'long', 'histo_record' => $histo], [
                    'value' => $prev_long_index->value - $premium,
                    'created_at' => $timestamp
                ]);

                if ($total_positions && $total_positions->total_short_value > 0) {
                    $adj = max(1, $total_positions->total_long_value / $total_positions->total_short_value);
                }

                $shortPerf = Index::updateOrCreate(['pair_id' => $pair->id, 'long_short' => 'short', 'histo_record' => $histo], [
                    'value' => $prev_short_index->value + $premium * $adj,
                    'created_at' => $timestamp
                ]);
            } else {
                $longPerf = Index::updateOrCreate(['pair_id' => $pair->id, 'long_short' => 'long', 'histo_record' => $histo], [
                    'value' => $prev_long_index->value,
                    'created_at' => $timestamp
                ]);

                $shortPerf = Index::updateOrCreate(['pair_id' => $pair->id, 'long_short' => 'short', 'histo_record' => $histo], [
                    'value' => $prev_short_index->value,
                    'created_at' => $timestamp
                ]);
            }

            $last_indices[] = [
                'pair_id' => $pair->id,
                'long' => $longPerf->value,
                'short' => $shortPerf->value,
                'time' => $timestamp
            ];

            $fixing = Fixing::updateOrCreate(['pair_id' => $pair->id], [
                'prev_spot' => $spot->prev_value,
                'spot' => $spot->current_value,
                'forward' => $vol_fwd->forward,
                'option_premium' => $premium
            ]);
        }

        return $last_indices;
    }

    public function pnlComputation()
    {
        $now = Carbon::now();
        $xpairs = Pair::where('counter_symbol', '!=', 'USD')->get();
        $natural_pairs = Pair::where('counter_symbol', 'USD')->get();
        $newestSpots = [];
        foreach ($natural_pairs as $natural_pair) {
            $newestSpot = Spot::where('pair_id', $natural_pair->id)->orderBy('updated_at', 'desc')->first();
            $newestSpot->load('pair');
            if ($newestSpot) {
                $newestSpots[$natural_pair->coin_symbol] = $newestSpot;
            }
        }

        $T = $this->getYieldsAndVolatilitiesFromMarket($newestSpots);

        $this->getCorrelatedParameters($T, $natural_pairs);
        if ($xpairs) {
            $this->getXPairsParameters($xpairs, $T, $now);
        }
        $last_indices = $this->computeFixings(Pair::all(), $T);

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
            $pusher->trigger('indices', 'data', ['indices' => $last_indices]);
        } catch (\Throwable $e) {
            $notify[] = ['warning', 'Pusher Not Properly Set'];
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }

        return true;
    }

    public function integration()
    {
        $natural_pairs = Pair::where('counter_symbol', 'USD')->get();

        $now = Carbon::now();

        $createdSpots = $this->storeSpots($natural_pairs, $now);
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
        $createdSpots = array_values($createdSpots);
        try {
            $pusher->trigger('pairs', 'data', ['pairs' => $createdSpots]);
        } catch (\Throwable $e) {
            $notify[] = ['warning', 'Pusher Not Properly Set'];
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }

        return true;
    }

    private function getOptionSymbol($coin, $opt_symb, $expiry, $new_spot_value)
    {
        $tick = Ticks::where('coin_symbol', $coin)->first()->value;
        $pair = Pair::where('coin_symbol', $coin)->first();
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
