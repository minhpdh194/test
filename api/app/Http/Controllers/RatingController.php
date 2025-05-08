<?php

namespace App\Http\Controllers;

//use App\Models\PnL\DailyPnL;
use App\Models\PnL\WeeklyPnl;
use App\Models\PnL\MonthlyPnL;
use App\Models\PnL\TotalPnL;
use App\Models\TelegramUser;
use App\Models\UserTransaction;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    private const MAX_RATING = 100;

    public function getRating(Request $request)
    {
        $pnl = [];
        if ($request->has('date')) {
            $pnl = TotalPnL::join('user_profile', 'total_pnl.telegram_user_id', '=', 'user_profile.telegram_user_id')
                ->join('user_game_data', 'total_pnl.telegram_user_id', '=', 'user_game_data.telegram_user_id')
                ->orderBy('total_pnl.pnl', 'desc')
                ->limit(RatingController::MAX_RATING)
                ->get(['total_pnl.*', 'user_profile.first_name', 'user_profile.last_name', 'user_game_data.avatar_id']);
        }

        if ($request->has('week')) {
            $now = Carbon::now('UTC');
            $pnl = WeeklyPnl::join('user_profile', 'weekly_pnl.telegram_user_id', '=', 'user_profile.telegram_user_id')
                ->join('user_game_data', 'weekly_pnl.telegram_user_id', '=', 'user_game_data.telegram_user_id')
                ->where(['year' => $now->year, 'week' => $now->weekOfYear])
                ->orderBy('weekly_pnl.pnl', 'desc')
                ->limit(RatingController::MAX_RATING)
                ->get(['weekly_pnl.*', 'user_profile.first_name', 'user_profile.last_name', 'user_game_data.avatar_id']);
        }

        if ($request->has('month')) {
            $now = Carbon::now('UTC');
            $pnl = MonthlyPnL::join('user_profile', 'monthly_pnl.telegram_user_id', '=', 'user_profile.telegram_user_id')
                ->join('user_game_data', 'monthly_pnl.telegram_user_id', '=', 'user_game_data.telegram_user_id')
                ->where(['year' => $now->year, 'month' => $now->month])
                ->orderBy('monthly_pnl.pnl', 'desc')
                ->limit(RatingController::MAX_RATING)
                ->get(['monthly_pnl.*', 'user_profile.first_name', 'user_profile.last_name', 'user_game_data.avatar_id']);
        }
        
        return response()->json($pnl);
    }

    public function getLeftUsers(Request $request)
    {
        $telegramUserIds = [];
        if ($request['played_users']) {
            $telegramUserIds = $request['played_users'];
            //$telegramUserIds = array_map(function ($item) {
            //    return $item['telegram_user_id'];
            //}, $request['played_users']);
        }

        $users = TelegramUser::with('userProfiles')->whereNotIn('telegram_user_id', $telegramUserIds)->limit(RatingController::MAX_RATING - count($telegramUserIds))->get();
        return response()->json($users);
    }
}
