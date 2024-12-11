<?php

namespace App\Http\Controllers;

use App\Models\StarsDefinition;
use App\Models\TelegramProfile;
use App\Models\TelegramUser;
use Illuminate\Http\Request;

class TelegramStarController extends Controller
{
    public function getAllStars()
    {
        $bonusDef = StarsDefinition::all();
        return response()->json($bonusDef);
    }

    public function buyStarPackage(Request $request) {
        $user = $request->user();
        $telegramProfile = TelegramProfile::where('telegram_user_id', $user->id)->first();
        $boughtPackage = StarsDefinition::findOrFail($request->id);

        if (!$boughtPackage) {
            return response()->json(['error' => 'Package not found'], 404);
        }

        if (!$telegramProfile) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $telegramProfile->number_of_stars += $boughtPackage->number_of_stars;
        $telegramProfile->save();

        return response()->json(['success' => 'Buy package successfully'], 200);
    }
}
