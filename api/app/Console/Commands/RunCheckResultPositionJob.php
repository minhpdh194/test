<?php

namespace App\Console\Commands;

use App\Models\TelegramProfile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Models\TelegramUser;
use App\Models\Position;
use App\Models\Spot;

class RunCheckResultPositionJob extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-check-result-position-job';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $getPosition = Position::whereNull('result')->get();

        foreach ($getPosition as $position) {
            $userProfile = TelegramProfile::where('id', $position->user_id)->first();

            $userTelegram = TelegramUser::where('id', $userProfile->telegram_user_id)->first();
            $getTrading = Spot::where('id', $position->position_id)->first();

            $discrepancyReturn = abs($position->open_return - $getTrading->return);
            $PnL = ($discrepancyReturn / $position->amount) * 100;

            $realPnL = $position->amount * $position->average_leverage - $position->amount;

            $currentPnl = is_array($userProfile->total_pnl) ? $userProfile->total_pnl : [
                'percentage' => 0,
                'amount' => 0
            ];

            if ($position->long_short == 'long') {
                if ($position->open_return < $getTrading->return) {
                    // Win
                    $position->result = 'win';
                    $userProfile->total_return_generated += $discrepancyReturn;

                    $currentPnl['percentage'] = round($currentPnl['percentage'] + $PnL, 2);
                    $currentPnl['amount'] += $realPnL;

                    $userTelegram->balance += $position->amount * $position->average_leverage;
                } elseif ($position->open_return == $getTrading->return) {
                    // Draw
                    $position->result = 'draw';
                    $userTelegram->balance += $position->amount;
                } else {
                    // Lose
                    $position->result = 'lose';

                    $currentPnl['percentage'] = round($currentPnl['percentage'] - $PnL, 2);
                    $currentPnl['amount'] -= $realPnL;
                }
            } else {
                if ($position->open_return < $getTrading->return) {
                    // Win
                    $position->result = 'win';
                    $userProfile->total_return_generated += $discrepancyReturn;

                    $currentPnl['percentage'] = round($currentPnl['percentage'] + $PnL, 2);
                    $currentPnl['amount'] += $realPnL;

                    $userTelegram->balance += $position->amount * $position->average_leverage;
                } elseif ($position->open_return == $getTrading->return) {
                    // Draw
                    $position->result = 'draw';
                    $userTelegram->balance += $position->amount;
                } else {
                    // Lose
                    $position->result = 'lose';

                    $currentPnl['percentage'] = round($currentPnl['percentage'] - $PnL, 2);
                    $currentPnl['amount'] -= $realPnL;
                }
            }

            $userProfile->total_pnl = $currentPnl;

            $position->save();
            $userProfile->save();
            $userTelegram->save();
        }
    }
}
