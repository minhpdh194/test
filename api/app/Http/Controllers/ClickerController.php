<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// Traits
use App\Http\Controllers\Clickers\Booster;
use DateTime;

// Models
use App\Models\BonusDefinitions\LevelBonusesDef;
use App\Models\TelegramUser;
use App\Models\Tasks\DailyTask;
use App\Services\TelegramUsersService;

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
        $telegramUser = TelegramUser::where('telegram_user_id', $user->id)->first();
        $gameData = UserGameData::where('telegram_user_id', $user->id)->first();
        $tasks = UserTasks::where('user_id', $gameData->user_id)->get();

        return response()->json([
            'user' => $telegramUser,
            'gameData' => $gameData,
            'restored_energy' => self::restoreEnergy($gameData->available_energy, $user->last_login),
            'tasks' => $tasks
        ]);
    }

    public function tap(Request $request)
    {
        \Log::info($request);
        $validated = $request->validate([
            'count' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $userProfile = UserProfile::where('telegram_user_id', $user->id)->first();

        $available_energy = $user->available_energy;
        $earned = $user->tap($validated['count']);
        return response()->json([
            'success' => true,
            'earned' => $earned,
            'balance' => $user->balance,
            'available_energy' => $available_energy,
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

    public function listDailyTasks(Request $request)
    {
        $user = $request->user();

        // fetch all daily tasks and check if they are available for the user
        $dailyTasks = DailyTask::query()
            ->leftJoin('telegram_user_daily_tasks', function ($join) use ($user) {
                $join->on('daily_tasks.id', '=', 'telegram_user_daily_tasks.daily_task_id')
                    ->where('telegram_user_daily_tasks.telegram_user_id', $user->id);
            })
            ->select(['daily_tasks.*', 'telegram_user_daily_tasks.completed',])
            ->selectRaw('daily_tasks.required_login_streak <= ? as available', [$user->login_streak])
            ->get();

        return response()->json($dailyTasks);
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

    public function claimDailyTaskReward(Request $request)
    {
        $user = $request->user();

        $task = DailyTask::where('required_login_streak', '<=', $user->login_streak)
            ->whereDoesntHave('telegramUsers', function ($query) use ($user) {
                $query->where('id', $user->id);
            })
            ->first();

        if ($task) {
            DB::transaction(function () use ($task, $user) {
                $user->increment('balance', $task->reward_coins);
                $user->dailyTasks()->attach($task->id, [
                    'completed' => true,
                    'updated_at' => now()
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Daily task reward claimed successfully',
                'balance' => $user->balance,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unable to claim daily task reward. Task may not be available or already completed for today.',
        ], 400);
    }

    public function setEthWallet(Request $request)
    {
        $request->validate([
            'eth_wallet' => 'required|string',
        ]);

        $user = $request->user();
        $user->ton_wallet = $request->input('eth_wallet');
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'TON Wallet address updated successfully',
            'ton_wallet' => $user->ton_wallet,
        ]);
    }

    private static function restoreEnergy($maxEnergy, $last_login)
    {
        $freq = (now() - $last_login) / 3600;
        if ($freq > 3) $freq = 3;
        return floor($freq / 3 * $maxEnergy);
    }
}
