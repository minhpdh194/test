<?php

namespace App\Http\Controllers;

use App\Models\UserGameData;
use Illuminate\Http\Request;

class TelegramStarController extends Controller
{
    public function buyStarPackage(Request $request) {
        $user = $request->user();
        $telegramProfile = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();

        if (!$telegramProfile) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $telegramProfile->number_of_stars += $request['package']['number_of_stars'];
        $telegramProfile->save();

        return response()->json(['success' => 'Buy package successfully'], 200);
    }
}
