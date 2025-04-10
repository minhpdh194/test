<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

// Traits
use App\Http\Controllers\Clickers\Booster;
use DateTime;

// Models
use App\Models\TelegramUser;
use App\Models\UserGameData;
use App\Models\Tasks\UserTasks;

class ClickerController extends Controller
{
    use Booster;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    { }

    public function sync(Request $request)
    {
        $user = $request->user();
        $telegramUser = TelegramUser::where('telegram_user_id', $user->telegram_user_id)->first();
        $gameData = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();
        $tasks = [];

        if ($gameData) {
            $tasks = UserTasks::where('telegram_user_id', $gameData->telegram_user_id)->get();
        }

        if ($gameData->last_tap) {
            $now = Carbon::now();
            $restoredEnergy = $gameData->available_energy + TelegramUser::restoreEnergy($now, $gameData->energy_limit, $user->last_tap);
            if ($restoredEnergy > $gameData->energy_limit) $restoredEnergy = $gameData->energy_limit;

            $gameData->available_energy = $restoredEnergy;
            $gameData->last_tap = $now;
            $gameData->save();
        }

        return response()->json([
            'user' => $telegramUser,
            'gameData' => $gameData,
            'tasks' => $tasks
        ]);
    }

    public function tap(Request $request)
    {
        $updateTime = Carbon::now();

        $validated = $request->validate([
            'count' => 'required|integer|min:1',
            'earn_per_tap' => 'required|integer|min:0'
        ]);

        $earnPerTap = $validated['earn_per_tap'];
        $user = $request->user();
        $userGameData = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();

        $tap = TelegramUser::tap($validated['count'], $updateTime, $userGameData, $earnPerTap);

        return response()->json([
            'success' => true,
            'earned' => $tap['earned'],
            'balance' => $tap['balance'],
            'amount_of_tokens' => $tap['amount_of_tokens'],
            'available_energy' => $tap['energy'],
        ]);
    }

    public function buyBoosterPack(Request $request)
    {
        return Booster::buyBoosterPack($request);
    }

    public function buyBooster(Request $request)
    {
        return Booster::buyBooster($request);
    }

    public function useDailyBooster(Request $request)
    {
        return Booster::useDailyBooster($request);
    }

    public function listLeaderboard(Request $request)
    {
        $request->validate([
            'level_id' => 'required|integer|exists:levels,id',
        ]);

        $levelId = $request->input('level_id');

        $topUsers = TelegramUser::where('level_id', $levelId)
            ->orderBy('production_per_hour', 'desc')
            ->take(100)
            ->get();

        return response()->json($topUsers);
    }
}
