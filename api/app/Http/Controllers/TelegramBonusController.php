<?php

namespace App\Http\Controllers;

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
    public function telegramBonus(Request $request)
    {
        $user = $request->user();
        $userProfile = TelegramUser::where('id', $user->id)->first();

        $bonus = UserBonuses::where("telegram_user_id", $userProfile->id)
            ->join('bonus_def', 'bonus_id', '=', 'bonus_def.id')
            ->select('bonus_def.*', 'user_bonuses.end_date')
            ->get();

        return response()->json($bonus);
    }

    public function bonusDef()
    {
        $bonusDef = BonusDef::all();
        return response()->json($bonusDef);
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
