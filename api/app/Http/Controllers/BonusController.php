<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use App\Models\TelegramUser;
use App\Models\Spot;
use App\Models\UserBonuses;
use App\Models\UserGameData;
use Carbon\Carbon;

class BonusController extends Controller
{
    public function buyBonus(Request $request)
    {
        $user = $request->user();
        $boughtBonus = $request->bonus;
        $isBonusBought = UserBonuses::where('bonus_id', $boughtBonus['id'])->where('telegram_user_id', $user->telegram_user_id)->first();
        if ($isBonusBought) {
            return response()->json(['success' => 'This bonus has been purchased'], 202);
        } else {
            $userData = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();
            $ownedStars = $userData->number_of_stars;
            if ($ownedStars < $boughtBonus['cost']) {
                return response()->json(['success' => "You don't have enough stars"], 202);
            }
            $userData->number_of_stars = $ownedStars - $boughtBonus["cost"];
            $userData->save();
            UserBonuses::create([
                'bonus_id' => $boughtBonus['id'],
                'telegram_user_id' => $user->telegram_user_id,
                'purchase_time' => Carbon::now(),
                'position_id' => 0,
            ]);
            return response()->json(['success' => 'Bonus list updated successfully'], 200);
        }
    }

    public function getBonuses(Request $request)
    {
        $user = $request->user();
        $bonuses = UserBonuses::where([
            'telegram_user_id' => $user->telegram_user_id,
            'is_expired' => false,
        ])->get();
        return response()->json($bonuses);
    }

    public function expiry(Request $request)
    {
        $validated = $request->validate([
            'telegram_user_id' => 'required',
            'bonus_ids' => 'required'
        ]);

        $telegram_user_id = $validated['telegram_user_id'];

        foreach ($validated['bonus_ids'] as $bonusId) {
            $bonus = UserBonuses::where(['id' => $bonusId, 'telegram_user_id' => $telegram_user_id])->first();
            if (!$bonus) {
                Log::info(`Issue with bonus Id $bonusId for user $telegram_user_id`);
                continue;
            }
            $bonus->is_expired = true;
            $bonus->save();
        }
    }
}
