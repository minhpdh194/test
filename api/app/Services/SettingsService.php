<?php

namespace App\Services;

use App\Models\Settings;
use Pusher\Pusher;

class SettingsService {
    public function getTotalStars() {
        $totalStars = Settings::where('name', 'stars_purchased')->first()->value;
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
            \Log::info('test pusher', ['result' => $totalStars]);
        } catch (\Throwable $e) {
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }
    }
}
