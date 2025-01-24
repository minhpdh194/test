<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\UserGameData;
use App\Models\Settings;
use Illuminate\Support\Facades\Http;
use Pusher\Pusher;

class TelegramStarController extends Controller
{
    protected $botToken;
    protected $apiUrl;

    public function __construct()
    {
        $this->botToken = env('TELEGRAM_BOT_API_TOKEN'); // Your Telegram bot token
        $this->apiUrl = "https://api.telegram.org/bot{$this->botToken}/";
    }

    public function getStarConversionRate()
    {
        $conversionRate = Settings::where(['name' => 'conversion_rate'])->first();
        return response()->json(["conversion_rate" => doubleval($conversionRate->value)]);
    }

    public function sendInvoice(Request $request)
    {
        $chatId = $request->input('chat_id');
        $package = $request->input('package');
        $price = $package['cost'];
        
        $payload = [
            'chat_id' => $chatId,
            'title' => 'Package with ' . $price,
            'description' => 'Good package',
            'payload' => 'unique_payload', // Use a unique identifier for the transaction
            'provider_token' => "", // Payment provider token
            'currency' => 'XTR', // Currency (can be USD, EUR, etc.)
            'prices' => [
                [
                    'label' => 'Buy Now',
                    'amount' => $price, // Price in smallest currency unit (e.g., cents)
                ]
            ],
        ];

        // Make a POST request to Telegram Bot API to send the invoice
        $response = Http::post($this->apiUrl . 'createInvoiceLink', $payload);
        if ($response->successful()) {
            return $response->json();
        } else {
            return $response->failed();
        }
    }

    public function buyStarPackage(Request $request)
    {
        $user = $request->user();
        $telegramProfile = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();

        if (!$telegramProfile) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $settings = Settings::where('name', 'stars_spent')->first();

        $telegramProfile->number_of_stars += $request['package']['number_of_stars'];
        $telegramProfile->save();

        $settings->value += $request['package']['number_of_stars'];
        $settings->save();

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
            $pusher->trigger('totalStars', 'data', ['totalStars' => $settings->value]);
            \Log::info('test pusher', ['result' => $settings->value]);
        } catch (\Throwable $e) {
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }

        return response()->json(['success' => 'Buy package successfully'], 200);
    }
}
