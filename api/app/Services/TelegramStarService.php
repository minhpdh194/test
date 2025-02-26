<?php

namespace App\Services;

use App\Models\MarketData\Spot;
use App\Models\Settings;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Pusher\Pusher;

class TelegramStarService
{
    public function sendInvoice($bonus, $telegram_user_id)
    {
        $botToken = env('TELEGRAM_BOT_API_TOKEN');
        $apiUrl = "https://api.telegram.org/bot{$botToken}/";

        $payload = [
            'title' => 'Package with ' . $bonus['cost'],
            'description' => 'Good package',
            'payload' => 'unique_payload_' . time() . '_' . $telegram_user_id,
            'provider_token' => "",
            'currency' => 'XTR',
            'prices' => [
                [
                    'label' => 'Buy with ' . $bonus['cost'] . ' stars',
                    'amount' => $bonus['cost'],
                ]
            ],
        ];

        // Make a POST request to Telegram Bot API to send the invoice
        $response = Http::post($apiUrl . 'createInvoiceLink', $payload);

        if ($response->successful()) {
            return $response->json();
        } else {
            return $response->failed();
        }
    }

    public function updateStarsInPusher()
    {
        $settings = Settings::where('name', 'stars_spent')->first();
        $conversion = Settings::where('name', 'conversion_rate')->first()->value;
        $total_coins = round(floatval($settings->value) / (0.025 * floatval($conversion)), 0, PHP_ROUND_HALF_DOWN) * 0.025;

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
            $pusher->trigger('totalCoins', 'data', ['totalCoins' => $total_coins]);
        } catch (\Throwable $e) {
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }
    }
}
