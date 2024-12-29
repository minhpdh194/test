<?php

namespace App\Services;

use App\Models\MarketData\Spot;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
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
            \Log::info('test pusher', ['result' => $spots]);
        } catch (\Throwable $e) {
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }
    }

    public function getNewestIndices() {
        $indices_perf = [];
        if (Storage::exists('indices_perf.json')) {
            $indices_perf = json_decode(Storage::get('indices_perf.json'), true);
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
            $pusher->trigger('indices', 'data', ['indices' => $indices_perf]);
            \Log::info('test pusher', ['result' => $indices_perf]);
        } catch (\Throwable $e) {
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }
    }
}
