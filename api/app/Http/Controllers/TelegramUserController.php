<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Pusher\Pusher;

use App\Models\TelegramUser;
use App\Models\MarketData\Spot;
use App\Models\BonusDefinitions\LevelBonusesDef;
use App\Models\MarketData\Position;
use App\Models\MarketData\VolatilityAndForward;
use App\Models\UserGameData;
use App\Services\TelegramUsersService;


class TelegramUserController extends Controller
{
    public function updateUserLevel(Request $request)
    {
        $user = $request->user();
        $level = $request->input('level');
        $userProfile = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();
        if ($userProfile) {
            $userProfile->update([
                'level' => $level,
                'available_energy' => 500
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Level updated successfully',
                'level' => $level
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'User profile not found'
        ], 404);
    }

    public function updateUserAvatar(Request $request)
    {
        $user = $request->user();
        $userProfile = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();
        $avatar_id = $request->input('avatar_id');

        if ($userProfile) {
            $userProfile->update([
                'avatar_id' => $avatar_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Avatar updated successfully',
                'avatar_id' => $avatar_id
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'User profile not found'
        ], 404);
    }

    public function saveUserWallet(Request $request)
    {
        $user = $request->user();
        $userProfile = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();

        if ($userProfile) {
            $userProfile->update([
                'crypto' => $request->crypto_id,
                'wallet_address' => $request->wallet_address
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Wallet updated successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'User profile not found'
        ], 404);
    }
}
