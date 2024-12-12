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
use App\Services\TelegramUsersService;

$botToken = "";


class AuthController extends Controller
{
    private $userService;

    public function __construct(TelegramUsersService $userService)
    {
        $this->userService = $userService;
    }

    public function userSession(Request $request)
    {
        $validated = $request->validate([
            'chat_id' => 'required',
            'telegram_id' => 'required'
        ]);

        $userSession = ActiveSessions::where(['telegram_id' => $request->get('telegram_id')])->first();

        if ($userSession) {
            $userSession->update($request->get('chat_id'));
        } else {
            $userSession = ActiveSessions::firstOrCreate(['telegram_id' => $request->get('telegram_id')],
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
            'telegram_id' => 'required',
            'first_name' => 'required|string',
            'last_name' => 'nullable|string',
            'username' => 'nullable|string',
            'referral_code' => 'sometimes|nullable|string'
        ]);

        $existUser = TelegramUser::where('telegram_user_id', $request->get('telegram_id'))->first();

        if ($existUser) {
            $existUser->updateLoginStreak();
            $token = $existUser->createToken($existUser->telegram_user_id);
            
            return response()->json([
                'login_streak' => $existUser->login_streak,
                'token' => $token->plainTextToken,
                'first_login' => false
            ]);
        }

        $baseBalance = 100_000;
        
        if ($request->get('referral_code') != null) {
            $referralData = FriendsInvitation::where(['invitee_id' => $request->get('telegram_id'), 'referral_code' => $request->get('referral_code')]).first();
            $referredBy = TelegramUser::where('telegram_user_id', $referralData->inviter_id)->first();

            if ($referredBy) {
                // We first update the referral, to specify that invitee has connected
                $referralData->update();
                // We send message to the inviter, for live update of user's balance
                sendMessage($referralData->inviter_id, 'referral: ' . $request->get('first_name'));
                // We update the database
                $inviterGameData = UserGameData::where('user_id', $referredBy->id)->first()->referralUpdate();
            }
        }

        $user = TelegramUser::firstOrCreate(
            [
                'telegram_user_id' => $request->get('telegram_id'),
            ],
            $validated
        );

        $gameData = UserGameData::firstOrCreate(['user_id' => $user->id],
            [
                'telegram_user_id' => $request->get('telegram_id'),
                'amount_of_tokens' => $baseBalance,
                'balance' => $baseBalance
            ]
        );

        $token = $user->createToken($user->telegram_id);

        return response()->json([
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
