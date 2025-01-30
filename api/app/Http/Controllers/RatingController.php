<?php

namespace App\Http\Controllers;

use App\Models\TelegramUser;
use App\Models\UserTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    public function getRating(Request $request)
    {
        $transactions = [];
        if ($request->has('date')) {
            $transactions = UserTransaction::with('userData')
                ->whereDate('created_at', $request->input('date'))
                ->select('telegram_user_id', DB::raw('SUM(amount_of_tokens) as tokens'))
                ->groupBy('telegram_user_id')
                ->orderBy('tokens', 'desc')
                ->limit(10)
                ->get();
        }

        if ($request->has('week')) {
            $week = $request->input('week');
            $transactions = UserTransaction::with('userData')
                ->whereBetween('created_at', [$week['start'], $week['end']])
                ->select('telegram_user_id', DB::raw('SUM(amount_of_tokens) as tokens'))
                ->groupBy('telegram_user_id')
                ->orderBy('tokens', 'desc')
                ->limit(10)
                ->get();
        }

        if ($request->has('month')) {
            $month = $request->input('month');
            $transactions = UserTransaction::with('userData')
                ->whereMonth('created_at', date('m', strtotime($month)))
                ->select('telegram_user_id', DB::raw('SUM(amount_of_tokens) as tokens'))
                ->groupBy('telegram_user_id')
                ->orderBy('tokens', 'desc')
                ->limit(10)
                ->get();
        }

        return response()->json($transactions);
    }

    public function getLeftUsers(Request $request)
    {
        $telegramUserIds = [];
        if ($request['played_users']) {
        $telegramUserIds = array_map(function ($item) {
            return $item['telegram_user_id'];
        }, $request['played_users']);
        }

        $users = TelegramUser::whereNotIn('telegram_user_id', $telegramUserIds)->limit(10 - count($telegramUserIds))->get();
        return response()->json($users);
    }
}
