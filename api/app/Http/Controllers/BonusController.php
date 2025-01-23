<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

use App\Models\UserBonuses;
use App\Models\UserGameData;
use App\Models\MarketData\Position;

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
            $bonus = UserBonuses::create([
                'bonus_id' => $boughtBonus['id'],
                'telegram_user_id' => $user->telegram_user_id,
                'purchase_time' => Carbon::now(),
                'position_id' => 0,
            ]);
            return response()->json(['success' => 'Bonus list updated successfully', 'bonus' => $bonus], 200);
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
            'bonus_ids' => 'required'
        ]);

        $telegram_user_id = $request->user()->telegram_user_id;

        foreach ($validated['bonus_ids'] as $bonusId) {
            $bonus = UserBonuses::where(['id' => $bonusId, 'telegram_user_id' => $telegram_user_id])->first();
            if (!$bonus) {
                Log::info(`Issue with bonus Id $bonusId for user $telegram_user_id`);
                continue;
            }

            $position = Position::where(['telegram_user_id' => $telegram_user_id, 'position_id' => $bonus->position_id])->first();

            $positionBonuses = json_decode($position->bonuses_id);

            $positionBonuses = array_filter($positionBonuses, function ($value) use ($bonusId) {
                return $value !== $bonusId;
            });

            $positionBonuses = array_values($positionBonuses);

            $position->bonuses_id = $positionBonuses;

            // We keep track of the bonuses used by the user
            // SHOULD WE?
            $bonus->is_expired = true;
            $bonus->save();
            $position->save();
        }
    }

    public function buyToken(Request $request)
    {
        $user = $request->user();
        $boughtBonus = $request->bonus;

        $userData = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();
        $userData->amount_of_tokens += $boughtBonus->benefit;
        $userData->save();
        return response()->json(['success' => 'Buy token successfully'], 200);
    }
}
