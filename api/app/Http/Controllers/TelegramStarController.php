<?php

namespace App\Http\Controllers;

use App\Services\TelegramStarService;
use Illuminate\Http\Request;

use App\Models\UserGameData;
use App\Models\Settings;
use App\Models\UserBonuses;
use Illuminate\Support\Facades\Http;
use Pusher\Pusher;

class TelegramStarController extends Controller
{
    private $telegramStarService;

    public function __construct(TelegramStarService $telegramStarService)
    {
        $this->telegramStarService = $telegramStarService;
    }

    public function getStarConversionRate()
    {
        $conversionRate = Settings::where(['name' => 'conversion_rate'])->first();
        return response()->json(["conversion_rate" => doubleval($conversionRate->value)]);
    }

    public function sendTelegramInvoice(Request $request)
    {
        $bonus = $request->input('bonus');
        $user = $request->user();

        $isBonusBought = UserBonuses::where('bonus_id', $bonus['id'])->where('telegram_user_id', $user->telegram_user_id)->first();
        if ($isBonusBought) {
            return response()->json(['ok' => false], 202);
        } else {
            return $this->telegramStarService->sendInvoice($bonus, $user->telegram_user_id);
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
