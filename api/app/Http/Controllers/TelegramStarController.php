<?php

namespace App\Http\Controllers;

use App\Services\TelegramStarService;
use Illuminate\Http\Request;

use App\Models\UserGameData;
use App\Models\Settings;
use App\Models\PendingInvoice;
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

        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $isBonusBought = UserBonuses::where('bonus_id', $bonus['id'])->where('telegram_user_id', $user->telegram_user_id)->first();
        if ($isBonusBought) {
            return response()->json(['ok' => false], 202);
        } else {
            if ($this->telegramStarService->sendInvoice($bonus, $user->telegram_user_id)) {

                // We record the invoice
                PendingInvoice::create([
                    'telegram_user_id' => $user->telegram_user_id,
                    'bonus_id' => $bonus['id']
                ]);

                return response()->json(['ok' => true], 202);
            } else {
                return response()->json(['ok' => false], 202);
            }
        }
    }

    public function removePendingInvoice(Request $request)
    {
        $bonus_id = $request->input('bonus_id');
        $user = $request->user();

        PendingInvoice::where(['telegram_user_id' => $user->telegram_user_id, 'bonus_id' => $bonus_id])->delete();
    }

    /* public function buyStarPackage(Request $request)
    {
        $user = $request->user();
        $telegramProfile = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();

        if (!$telegramProfile) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $settings = Settings::where('name', 'stars_spent')->first();
        $conversion = Settings::where('name', 'conversion_rate')->first()->value;
        $total_coins = round(floatval($settings->value) / (0.025 * floatval($conversion)), 0, PHP_ROUND_HALF_DOWN) * 0.025;

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
            $pusher->trigger('totalCoins', 'data', ['totalCoins' => $total_coins]);
        } catch (\Throwable $e) {
            \Log::info('error pusher', ['error' => $e->getMessage()]);
        }

        return response()->json(['success' => 'Buy package successfully'], 200);
    } */
}
