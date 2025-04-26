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
        $user_id = $request->input('telegram_user_id');

        if (!$user_id) return response()->json(['error' => 'User not found'], 404);

        $isBonusBought = UserBonuses::where(['bonus_id' => $bonus['id'], 'telegram_user_id' => $user_id, 'is_expired' => false])
            ->whereNotNull('end_date')
            ->first();

        if ($isBonusBought) {
            return response()->json(['ok' => false, 'bought' => true], 202);
        } else {
            $result = $this->telegramStarService->sendInvoice($bonus, $user_id);
            
            if ($result) {
                PendingInvoice::create([
                    'telegram_user_id' => $user_id,
                    'bonus_id' => $bonus['id'],
                    'number_of_stars' => 0,
                ]);

                return response()->json(['ok' => true, 'url' => $result]);
            }

            return response()->json(['ok' => false, 'err_invoice' => true], 202);
        }
    }

    public function removePendingInvoice(Request $request)
    {
        $bonus_id = $request->input('bonus_id');
        $user = $request->user();

        PendingInvoice::where(['telegram_user_id' => $user->telegram_user_id, 'bonus_id' => $bonus_id, 'paid' => false])->delete();
    }
}
