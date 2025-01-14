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
    public function referredUsers(Request $request)
    {
        $user = $request->user();

        $referredUsers = TelegramUser::with(['level'])
            ->where('referred_by', $user->telegram_user_id)
            ->paginate($request->get('per_page') ?? 10);

        return response()->json($referredUsers);
    }

    public function levelBenefit(Request $request)
    {
        $user = $request->user();

        $userProfile = UserProfile::where('telegram_user_id', $user->id)->first();
        $bonuses = LevelBonusesDef::whereBetween('level', [1, min($userProfile->level, 25)])->get();
        $totalPositiveLeverageBonus = $bonuses->sum('positive_leverage_bonus');
        $totalProtectionBonus = $bonuses->sum('protection_bonus');
        $totalTimeBonus = $bonuses->sum('time_bonus');

        $pairsUnlocked = $bonuses->pluck('pairs_unlocked')->filter()->toArray();

        $combinedPairsUnlocked = array_reduce($pairsUnlocked, function ($carry, $item) {
            $decodedItem = is_string($item) ? json_decode($item, true) : $item;
            return array_merge($carry, $decodedItem ?? []);
        }, []);

        $combinedPairsUnlocked = array_unique($combinedPairsUnlocked);

        $currentLevelBonus = $userProfile->level > 25
            ? LevelBonusesDef::where('level', 25)->first()
            : LevelBonusesDef::where('level', $userProfile->level)->first();

        if (!$currentLevelBonus) {
            return response()->json(['message' => 'Level data not found'], 404);
        }

        $cumulatedPositiveLeverageBonus = $currentLevelBonus->cumulated_positive_leverage_bonus;
        $protectionBonus = $currentLevelBonus->protection_bonus;
        $cumulatedProtectionBonus = $currentLevelBonus->cumulated_protection_bonus;
        $timeBonus = $currentLevelBonus->time_bonus;
        $tappingAmount = $currentLevelBonus->tapping_amount;
        $cumulatedTappingAmount = $currentLevelBonus->cumulated_tapping_amount;
        $gainPerTap = $currentLevelBonus->gain_per_tap;
        $totalReturnGenerated = $currentLevelBonus->total_return_generated;
        $cumulatedTokensGain = $currentLevelBonus->cumulated_tokens_gain;

        if ($userProfile->level > 25) {
            $extraLevels = $userProfile->level - 25;
            $totalPositiveLeverageBonus += $totalPositiveLeverageBonus * 0.25 * $extraLevels;
            $totalProtectionBonus = min($totalProtectionBonus + $extraLevels, 90);
            $totalTimeBonus = min($totalTimeBonus + $extraLevels, 350);
            $tappingAmount += 10000 * $extraLevels;
            $totalReturnGenerated += 50 * $extraLevels;
            $cumulatedTokensGain += 2000000 * $extraLevels;
        }

        return response()->json([
            'trading_unlocked' => $combinedPairsUnlocked,
            'total_positive_leverage_bonus' => $totalPositiveLeverageBonus,
            'total_protection_bonus' => $totalProtectionBonus,
            'total_time_bonus' => $totalTimeBonus,
            'positive_leverage_bonus' => $protectionBonus,
            'cumulated_positive_leverage_bonus' => $cumulatedPositiveLeverageBonus,
            'protection_bonus' => $protectionBonus,
            'cumulated_protection_bonus' => $cumulatedProtectionBonus,
            'time_bonus' => $timeBonus,
            'tapping_amount' => $tappingAmount,
            'cumulated_tapping_amount' => $cumulatedTappingAmount,
            'gain_per_tap' => $gainPerTap,
            'total_return_generated' => $totalReturnGenerated,
            'cumulated_tokens_gain' => $cumulatedTokensGain,
        ]);
    }

    public function conditionBenefitLevelUp()
    {
        $levelCondition = LevelBonusesDef::all();
        return response()->json($levelCondition);
    }

    public function updateUserLevel(Request $request)
    {
        $user = $request->user();
        $level = $request->input('level');
        $userProfile = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();
        if ($userProfile) {
            $userProfile->update([
                'level' => $level
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
}
