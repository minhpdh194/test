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
    public function calculatePnlUpdate()
    {
        try {
            $pnlString = Settings::where('name', 'pnl_date')->first()->value;
            $pnlDate = Carbon::parse($pnlString);
            $userTransactions = UserTransaction::where("created_at", ">", $pnlDate)->get();
            foreach ($userTransactions as $userTransaction) {
                $this->calculateDailyPnl($userTransaction);
                $this->calculateWeeklyPnl($userTransaction);
                $this->calculateMonthlyPnl($userTransaction);
            }
            Settings::update(
                ['name' => 'pnl_date'],
                ['value' => Carbon::now()]
            );
        } catch (\Exception $e) {
            \Log::info($e);
            Settings::updateOrCreate(
                ['name' => 'pnl_date'],
                ['value' => Carbon::now()]
            );
        }
    }

    private function calculateDailyPnl($userTransaction)
    {
        $userDailyPnL = DailyPnL::where(['telegram_user_id' => $userTransaction->telegram_user_id])
            ->whereDate('created_at', Carbon::today())
            ->first();
        if ($userDailyPnL) {
            $userDailyPnL->pnl += $userTransaction->amount_of_tokens;
            $userDailyPnL->save();
        } else {
            DailyPnL::create([
                'telegram_user_id' => $userTransaction->telegram_user_id,
                'pnl' => $userTransaction->amount_of_tokens,
            ]);
        }
    }

    private function calculateWeeklyPnl($userTransaction)
    {
        $userWeeklyPnL = WeeklyPnl::where(['telegram_user_id' => $userTransaction->telegram_user_id])
            ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->first();
        if ($userWeeklyPnL) {
            $userWeeklyPnL->pnl += $userTransaction->amount_of_tokens;
            $userWeeklyPnL->save();
        } else {
            WeeklyPnl::create([
                'telegram_user_id' => $userTransaction->telegram_user_id,
                'pnl' => $userTransaction->amount_of_tokens,
                'year' => Carbon::now()->year,
                'week' => Carbon::now()->weekOfYear,
            ]);
        }
    }

    private function calculateMonthlyPnl($userTransaction)
    {
        $userMonthlyPnL = MonthlyPnL::where(['telegram_user_id' => $userTransaction->telegram_user_id])
            ->whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
            ->first();
        if ($userMonthlyPnL) {
            $userMonthlyPnL->pnl += $userTransaction->amount_of_tokens;
            $userMonthlyPnL->save();
        } else {
            MonthlyPnL::create([
                'telegram_user_id' => $userTransaction->telegram_user_id,
                'pnl' => $userTransaction->amount_of_tokens,
                'year' => Carbon::now()->year,
                'month' => Carbon::now()->month,
            ]);
        }
    }
}
