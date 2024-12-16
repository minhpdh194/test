<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use App\Models\TelegramUser;
use App\Models\Spot;
use App\Models\BonusDefinitions\LevelBonusesDef;
use App\Models\BonusDefinitions\BonusDef;
use App\Models\UserBonuses;
use App\Models\MarketData\VolatilityAndForward;

class TelegramBonusController extends Controller
{
    public function buyBonus(Request $request)
    {
        $user = $request->user();
        $isBonusBought = UserBonuses::where('bonus_id', $request->bonus_id)->where('user_id', $user->telegram_user_id)->first();
        if ($isBonusBought) {
            return response()->json(['success' => 'This bonus has been purchased'], 202);
        } else {
            UserBonuses::create([
                'bonus_id' => $request->bonus_id,
                'user_id' => $user->telegram_user_id,
                'purchase_time' => Carbon::now(),
            ]);
            return response()->json(['success' => 'Bonus list updated successfully'], 200);
        }
    }

    public function getBonuses(Request $request)
    {
        $user = $request->user();
        $bonuses = UserBonuses::where([
            'user_id' => $user->telegram_user_id,
            'is_expired' => false,
        ])->pluck('bonus_id')->toArray();
        return response()->json($bonuses);
    }

    public function expiry(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required',
            'bonus_ids' => 'required'
        ]);

        $user_id = $validated['user_id'];

        foreach ($validated['bonus_ids'] as $bonusId) {
            $bonus = UserBonuses::where(['id' => $bonusId, 'user_id' => $user_id])->first();
            if (!$bonus) {
                Log::info(`Issue with bonus Id $bonusId for user $user_id`);
                continue;
            }
            $bonus->is_expired = true;
            $bonus->save();
        }
    }
}
