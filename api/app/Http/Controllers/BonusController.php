<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use App\Models\TelegramUser;
use App\Models\Spot;
use App\Models\UserBonuses;

class BonusController extends Controller
{
    public function getBonuses(Request $request)
    {
        $user = $request->user();
        $userProfile = TelegramUser::where('telegram_user_id', $user->id)->first();

        $bonuses = UserBonuses::select('id', 'bonus_id', 'position_id', 'end_date')->where(["user_id" => $userProfile->id, 'is_expired' => false])->get();
        return response()->json($bonuses);
    }

    public function expiry(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required',
            'bonus_ids' => 'required'
        ]);

        $user_id = $validated['user_id'];

        foreach ($validated['bonus_ids'] as $bonusId)
        {
            $bonus = UserBonuses::where(['id' => $bonusId, 'user_id' => $user_id])->first();
            if (!$bonus) { Log::info(`Issue with bonus Id $bonusId for user $user_id`); continue; }
            $bonus->is_expired = true;
            $bonus->save();
        }
    }

    public function buyBonus(Request $request)
    {
        $user = $request->user();
        $bonus_list = $request->id;

        // Retrieve bonus details
        $bonus = BonusDef::where('id', $bonus_list)->first();
        Log::info($bonus);


        // $telegramUser = TelegramUser::where('id', $user->id)->first();
        // $wallet = $telegramUser->ton_wallet - $bonus->cost;
        // Log::info($wallet);

        // if ($wallet < 0) {
        //     return response()->json(['error' => 'Not enough money'], 404);
        // }

        $telegramUser = TelegramUser::where('id', $user->id)->first();

        if (!$telegramUser) {
            return response()->json(['error' => 'User not found'], 404);
        }


        $userBonuses = UserBonuses::where("user_id", $telegramUser->id)->where("bonus_id", $bonus_list)->get();
        if ($userBonuses->isEmpty()) {
            UserBonuses::create([
                'user_id' => $telegramUser->id,
                'bonus_id' => $bonus->id
            ]);
        } else {
            return response()->json(['success' => 'This bonus has been purchased'], 202);
        }
        // $telegramUser->ton_wallet = $wallet;
        // $telegramUser->save();

        return response()->json(['success' => 'Bonus list updated successfully'], 200);
    }
}
