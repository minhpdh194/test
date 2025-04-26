<?php

namespace App\Services;

use App\Models\DailyPnL;
use App\Models\MonthlyPnL;
use App\Models\Settings;
use App\Models\UserTransaction;
use App\Models\WeeklyPnl;
use Carbon\Carbon;

class PnLRankingService
{
    public function calculatePnlUpdate($newPnLDate)
    {
        try {
            $pnlString = Settings::where('name', 'pnl_date')->first()->value;
            $lastPnLDate = Carbon::parse($pnlString);

            $isSameDay = $lastPnLDate->isSameDay($newPnLDate);
            $isSameWeek = $lastPnLDate->weekOfYear == $newPnLDate->weekOfYear;
            $isSameMonth = $lastPnLDate->isSameMonth($newPnLDate);

            $transactionsByUser = UserTransaction::where("created_at", ">", $lastPnLDate)
                ->where("created_at", "<=", $newPnLDate)
                ->groupBy('telegram_user_id')
                ->get();

            foreach ($transactionsByUser as $transactionsForUser) {
                $changeInPnl = $this->calculateDailyPnl($transactionsForUser, $newPnLDate, $isSameDay);
                $this->calculateWeeklyPnl($transactionsForUser->telegram_user_id, $changeInPnl, $newPnLDate, $isSameWeek);
                $this->calculateMonthlyPnl($transactionsForUser->telegram_user_id, $changeInPnl, $newPnLDate, $isSameMonth);
            }

            Settings::update(
                ['name' => 'pnl_date'],
                ['value' => $newPnLDate]
            );
        } catch (\Exception $e) {
            \Log::info($e);
            Settings::updateOrCreate(
                ['name' => 'pnl_date'],
                ['value' => $newPnLDate]
            );
        }
    }

    private function calculateDailyPnl($transactionsForUser, $pnlDate, $iSameDay)
    {
        $userDailyPnL = DailyPnL::where(['telegram_user_id' => $userTransaction->telegram_user_id])->first();

        // If we have changed day, we reset the daily PnL
        if (!$iSameDay) $userDailyPnL->pnl = 0;
        $changeInPnl = 0;

        foreach ($transactionsForUser as $userTransaction) {
            $userDailyPnL->pnl += $userTransaction->amount_of_tokens;
            $changeInPnl += $userTransaction->amount_of_tokens;
        }

        $userDailyPnL->save();
        return $changeInPnl;
    }

    private function calculateWeeklyPnl($telegram_user_id, $changeInPnl, $pnlDate, $iSameWeek)
    {
        if ($iSameWeek) {
            $userWeeklyPnL = WeeklyPnL::where(['telegram_user_id' => $telegram_user_id, 'year' => $pnlDate->year, 'week' => $pnlDate->weekOfYear])->first();
            $userWeeklyPnL->pnl += $changeInPnl;
            $userWeeklyPnL->save();
        } else {
            $userWeeklyPnL = WeeklyPnl::create([
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
    }
}
