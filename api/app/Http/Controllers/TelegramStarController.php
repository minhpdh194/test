<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\UserGameData;
use App\Models\Settings;

class TelegramStarController extends Controller
{
    public function buyStarPackage(Request $request) {
        $user = $request->user();
        $telegramProfile = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();

        if (!$telegramProfile) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $settings = Settings::where('name', 'stars_purchased')->first();

        $telegramProfile->number_of_stars += $request['package']['number_of_stars'];
        $telegramProfile->save();

        $settings->value += $request['package']['number_of_stars'];
        $settings->save();

        return response()->json(['success' => 'Buy package successfully'], 200);
    }
}
