<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

use App\Models\FriendsInvitation;
use App\Models\ActiveSessions;
use App\Models\TelegramUser;
use App\Models\UserGameData;
use App\Models\UserBonuses;
use App\Models\UserRanking;

$botToken = "";


class AuthController extends Controller
{
    public function userSession(Request $request)
    {
        $validated = $request->validate([
            'chat_id' => 'required',
            'telegram_user_id' => 'required'
        ]);

        $userSession = ActiveSessions::where(['telegram_user_id' => $request->get('telegram_user_id')])->first();

        if ($userSession) {
            $userSession->update($request->get('chat_id'));
        } else {
            $userSession = ActiveSessions::firstOrCreate(
                ['telegram_id' => $request->get('telegram_user_id')],
                [
                    'chat_id' => $request->get('chat_id'),
                    'last_activity' => now()
                ]
            );
        }
    }

    public function telegramUser(Request $request)
    {
        $validated = $request->validate([
            'telegram_user_id' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'nullable|string',
            'username' => 'nullable|string',
        ]);

        $existUser = TelegramUser::where('telegram_user_id', $request->get('telegram_user_id'))->first();

        if ($existUser) {
            $existUser->updateLoginStreak();
            $token = $existUser->createToken($existUser->telegram_user_id);

            return response()->json([
                'login_streak' => $existUser->login_streak,
                'token' => $token->plainTextToken,
                'first_login' => false
            ]);
        }

        $baseBalance = 100000;

        $user = TelegramUser::firstOrCreate(
            [
                'telegram_user_id' => $request->get('telegram_user_id'),
            ],
            $validated
        );

        $gameData = UserGameData::firstOrCreate(
            ['telegram_user_id' => $user->telegram_user_id],
            [
                'telegram_user_id' => $user->telegram_user_id,
                'amount_of_tokens' => $baseBalance,
                'balance' => $baseBalance
            ]
        );

        if ($request->get('referral_code') != null) {
            $referredBy = TelegramUser::where('telegram_user_id', $request->get('referral_code'))->first();

            if ($referredBy) {
                // $referralData = FriendsInvitation::where(['invitee_id' => $request->get('telegram_user_id'), 'referral_code' => $request->get('referral_code')])->first();
                $referralData = FriendsInvitation::create([
                    'inviter_id' => $request->get('referral_code'),
                    'invitee_id' => $request->get('telegram_user_id'),
                    'referral_code' => $request->get('referral_code')
                ]);
                // We first update the referral, to specify that invitee has connected
                $referralData->updateFirstConnection();
                // We send message to the inviter, for live update of user's balance
                // sendMessage($referralData->inviter_id, 'referral: ' . $request->get('first_name'));
                //later, comment it to avoid error
                // We update the database
                UserGameData::where('telegram_user_id', $referredBy->telegram_user_id)->first()->referralUpdate();
                $gameData->updateInvitedUserBalance();
            }
        }

        // $UserRankingData = UserRanking::updateOrCreate(
        //     ['telegram_user_id' => $user->telegram_user_id],
        //     [
        //         'first_name' => $user->first_name,
        //         'last_name' => $user->last_name,
        //         'last_amount_of_tokens' => $baseBalance,
        //         'current_amount_of_tokens' => $baseBalance,
        //     ]
        // );
        //we dont need to use it any more

        $token = $user->createToken($user->telegram_user_id);

        return response()->json([
            'login_streak' => 1,
            'token' => $token->plainTextToken,
            'first_login' => true,
        ]);
    }

    private function sendMessage($userId, $message)
    {
        $activeSession = ActiveSessions::where('telegram_user_id', $userId)->first();

        global $botToken;
        $url = "https://api.telegram.org/bot$botToken/sendMessage";

        $postData = [
            'chat_id' => $activeSession->chat_id,
            'text' => $message,
        ];

        $options = [
            'http' => [
                'header'  => "Content-Type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($postData),
            ],
        ];

        $context = stream_context_create($options);
        file_get_contents($url, false, $context);
    }
}
