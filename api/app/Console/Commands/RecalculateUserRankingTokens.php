<?php

namespace App\Console\Commands;

use App\Models\UserGameData;
use App\Models\UserRanking;
use Illuminate\Console\Command;

class RecalculateUserRankingTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:recalculate-user-ranking-tokens';

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
        $userRankings = UserRanking::all();
        foreach ($userRankings as $userRanking) {
            $currentToken = UserGameData::where('telegram_user_id', $userRanking->telegram_user_id)->first()->amount_of_tokens;
            $userRanking->last_amount_of_tokens = $userRanking->current_amount_of_tokens;
            $userRanking->current_amount_of_tokens = $currentToken;
            $userRanking->save();
        }
    }
}
