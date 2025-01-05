<?php

namespace Database\Seeders;

use App\Models\TelegramUser;
use App\Models\UserGameData;
use App\Models\UserRanking;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserRankingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userProfile = TelegramUser::all();

        foreach ($userProfile as $user) {
            $userGameData = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();

            UserRanking::updateOrCreate(
                ['telegram_user_id' => $user->telegram_user_id],
                [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'last_amount_of_tokens' => $userGameData->amount_of_tokens,
                    'current_amount_of_tokens' => $userGameData->amount_of_tokens,
                ]
            );
        }
    }
}
