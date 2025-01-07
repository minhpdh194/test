<?php

namespace App\Http\Controllers;

use App\Models\UserTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    public function getRating(Request $request)
    {
        \Log::info($request);
        $transactions = [];
        if ($request->has('date')) {
            $transactions = UserTransaction::with('userData')
                ->whereDate('created_at', $request->input('date'))
                ->select('telegram_user_id', DB::raw('SUM(amount_of_tokens) as tokens'))
                ->groupBy('telegram_user_id')
                ->get();
        }

        if ($request->has('week')) {
            $week = $request->input('week');
            $transactions = UserTransaction::with('userData')
                ->whereBetween('created_at', [$week['start'], $week['end']])
                ->select('telegram_user_id', DB::raw('SUM(amount_of_tokens) as tokens'))
                ->groupBy('telegram_user_id')
                ->get();
        }

        if ($request->has('month')) {
            $month = $request->input('month');
            $transactions = UserTransaction::with('userData')
                ->whereMonth('created_at', date('m', strtotime($month)))
                ->select('telegram_user_id', DB::raw('SUM(amount_of_tokens) as tokens'))
                ->groupBy('telegram_user_id')
                ->get();
        }

        return response()->json($transactions);
    }
}
