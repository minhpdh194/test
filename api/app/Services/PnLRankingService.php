<?php

namespace App\Services;

//use App\Models\PnL\DailyPnL;
use App\Models\PnL\WeeklyPnl;
use App\Models\PnL\MonthlyPnL;
use App\Models\PnL\TotalPnL;
use App\Models\Settings;
use App\Models\UserTransaction;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PnLRankingService
{
    public function calculatePnlUpdate($newPnLDate)
    {
        try {
            $pnlString = Settings::where('name', 'pnl_date')->first()->value;
            $lastPnLDate = Carbon::parse($pnlString);

            $isSameWeek = $lastPnLDate->weekOfYear == $newPnLDate->weekOfYear;
            $isSameMonth = $lastPnLDate->isSameMonth($newPnLDate);

            $transactionsByUser = UserTransaction::select('telegram_user_id', DB::raw('SUM(amount_of_tokens) as total_transactions'))
                ->where("created_at", ">", $lastPnLDate)
                ->where("created_at", "<=", $newPnLDate)
                ->groupBy('telegram_user_id')
                ->get();

            //if (!$lastPnLDate->isSameDay($newPnLDate)) {
            //    $daily = DailyPnL::truncate();
            //}

            foreach ($transactionsByUser as $transactionsForUser) {
                //$changeInPnl = $this->calculateDailyPnl($transactionsForUser);
                $changeInPnl = $this->calculateTotalPnl($transactionsForUser);
                $this->calculateWeeklyPnl($transactionsForUser->telegram_user_id, $changeInPnl, $newPnLDate, $isSameWeek);
                $this->calculateMonthlyPnl($transactionsForUser->telegram_user_id, $changeInPnl, $newPnLDate, $isSameMonth);
            }

            Settings::where('name', 'pnl_date')->update(['value' => $newPnLDate]);
        } catch (\Exception $e) {
            \Log::info($e);
        }
    }

    private function calculateDailyPnl($transactionsForUser)
    {
        $userDailyPnL = DailyPnL::where(['telegram_user_id' => $transactionsForUser->telegram_user_id])->first();

        // If the user has no daily PnL record, create one
        if (!$userDailyPnL) {
            $userDailyPnL = DailyPnL::create([
                'telegram_user_id' => $transactionsForUser->telegram_user_id,
                'pnl' => 0,
            ]);
        }

        $userDailyPnL->pnl += $transactionsForUser->total_transactions;
        $userDailyPnL->save();

        return $transactionsForUser->total_transactions;
    }

    private function calculateTotalPnl($transactionsForUser)
    {
        $userTotalPnL = TotalPnL::where(['telegram_user_id' => $transactionsForUser->telegram_user_id])->first();

        if ($userTotalPnL) {
            $userTotalPnL->pnl += $transactionsForUser->total_transactions;
        } else {
            $userTotalPnL = TotalPnL::create([
                'telegram_user_id' => $transactionsForUser->telegram_user_id,
                'pnl' => $transactionsForUser->total_transactions,
            ]);

            $monthlyPnLs = MonthlyPnL::where(['telegram_user_id' => $transactionsForUser->telegram_user_id])->get();

            foreach ($monthlyPnLs as $monthlyPnL) {
                $userTotalPnL->pnl += $monthlyPnL->pnl;
            }
        }

        $userTotalPnL->save();
        return $transactionsForUser->total_transactions;
    }

    private function calculateWeeklyPnl($telegram_user_id, $changeInPnl, $pnlDate, $iSameWeek)
    {
        if ($iSameWeek) {
            $userWeeklyPnL = WeeklyPnL::where(['telegram_user_id' => $telegram_user_id, 'year' => $pnlDate->year, 'week' => $pnlDate->weekOfYear])->first();

            if ($userWeeklyPnL) {
                $userWeeklyPnL->pnl += $changeInPnl;
                $userWeeklyPnL->save();
            } else {
                WeeklyPnl::create([
                    'telegram_user_id' => $telegram_user_id,
                    'pnl' => $changeInPnl,
                    'year' => $pnlDate->year,
                    'week' => $pnlDate->weekOfYear,
                ]);
            }
        } else {
            WeeklyPnl::create([
                'telegram_user_id' => $telegram_user_id,
                'pnl' => $changeInPnl,
                'year' => $pnlDate->year,
                'week' => $pnlDate->weekOfYear,
            ]);
        }
    }

    private function calculateMonthlyPnl($telegram_user_id, $changeInPnl, $pnlDate, $iSameMonth)
    {
        if ($iSameMonth) {
            $userMonthlyPnL = MonthlyPnL::where(['telegram_user_id' => $telegram_user_id, 'year' => $pnlDate->year, 'month' => $pnlDate->month])->first();
            if ($userMonthlyPnL) {
                $userMonthlyPnL->pnl += $changeInPnl;
                $userMonthlyPnL->save();
            } else {
                MonthlyPnL::create([
                    'telegram_user_id' => $telegram_user_id,
                    'pnl' => $changeInPnl,
                    'year' => $pnlDate->year,
                    'month' => $pnlDate->month,
                ]);
            }
        } else {
            MonthlyPnL::create([
                'telegram_user_id' => $telegram_user_id,
                'pnl' => $changeInPnl,
                'year' => $pnlDate->year,
                'month' => $pnlDate->month,
            ]);
        }
    }
}
