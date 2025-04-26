<?php

namespace App\Http\Controllers;

use App\Models\DailyPnL;
use App\Models\MonthlyPnL;
use App\Models\TelegramUser;
use App\Models\UserTransaction;
use App\Models\WeeklyPnl;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    public function getRating(Request $request)
    {
        $pnl = [];
        if ($request->has('date')) {
            $pnl = DailyPnL::join('user_profile', 'daily_pnl.telegram_user_id', '=', 'user_profile.telegram_user_id')
                ->join('user_game_data', 'daily_pnl.telegram_user_id', '=', 'user_game_data.telegram_user_id')
                ->orderBy('daily_pnl.pnl', 'desc')
                ->limit(100)
                ->get(['daily_pnl.*', 'user_profile.first_name', 'user_profile.last_name', 'user_game_data.avatar_id']);
        }

        if ($request->has('week')) {
            $pnl = WeeklyPnl::join('user_profile', 'weekly_pnl.telegram_user_id', '=', 'user_profile.telegram_user_id')
                ->join('user_game_data', 'weekly_pnl.telegram_user_id', '=', 'user_game_data.telegram_user_id')
                ->where('week', Carbon::now()->weekOfYear)
                ->orderBy('weekly_pnl.pnl', 'desc')
                ->limit(100)
                ->get(['weekly_pnl.*', 'user_profile.first_name', 'user_profile.last_name', 'user_game_data.avatar_id']);
        }

        if ($request->has('month')) {
            $pnl = MonthlyPnL::join('user_profile', 'monthly_pnl.telegram_user_id', '=', 'user_profile.telegram_user_id')
                ->join('user_game_data', 'monthly_pnl.telegram_user_id', '=', 'user_game_data.telegram_user_id')
                ->where('month', Carbon::now()->month)
                ->orderBy('monthly_pnl.pnl', 'desc')
                ->limit(100)
                ->get(['monthly_pnl.*', 'user_profile.first_name', 'user_profile.last_name', 'user_game_data.avatar_id']);
        }
        \Log::info($pnl);
        return response()->json($pnl);
    }

    public function getLeftUsers(Request $request)
    {
        $telegramUserIds = [];
        if ($request['played_users']) {
        $telegramUserIds = array_map(function ($item) {
            return $item['telegram_user_id'];
        }, $request['played_users']);
        }

        $users = TelegramUser::with('userProfiles')->whereNotIn('telegram_user_id', $telegramUserIds)->limit(10 - count($telegramUserIds))->get();
        \Log::info($users);
        return response()->json($users);
    }
}
