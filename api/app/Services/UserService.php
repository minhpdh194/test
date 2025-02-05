<?php

namespace App\Services;

use App\Models\MarketData\Spot;
use App\Models\Settings;
use Carbon\Carbon;
use Pusher\Pusher;

class UserService
{
    public function getNewestSpots()
    {
        $spots = Spot::with('pair')->whereDate('created_at', '=', Carbon::today()->toDateString())
            ->get();

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
            $pusher->trigger('pairs', 'data', ['pairs' => $spots]);
        } catch (\Throwable $e) {
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }
    }

    public function getCurrentTotalStars()
    {
        $totalStars = Settings::where('name', 'stars_spent')->first()->value;
        $conversion = Settings::where('name', 'conversion_rate')->first()->value;
        $total_coins = round(floatval($totalStars) / (0.025 * floatval($conversion)), 0, PHP_ROUND_HALF_DOWN) * 0.025;

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
            $pusher->trigger('totalStars', 'data', ['totalStars' => $totalStars]);
        } catch (\Throwable $e) {
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }
    }
}
