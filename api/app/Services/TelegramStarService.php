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
}
