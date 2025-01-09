<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\FriendsInvitation;
use App\Models\TelegramUser;
use App\Models\UserGameData;

class FriendsController extends Controller
{
    public function referredUsers(Request $request)
    {
        $user = $request->user();
        $userId = $user->telegram_user_id;
        $referredFriends = [];
        $friends = FriendsInvitation::where(['inviter_id' => $userId, 'has_connected' => true])->get();
        $userGameData = UserGameData::where('telegram_user_id', $userId)->first();

        if ($friends) {
            foreach ($friends as $friend) {
                $invitedUser = TelegramUser::where('telegram_user_id', $friend->invitee_id)->first();

                $referredFriends[] = [
                    'telegram_user_id' => $invitedUser->telegram_user_id,
                    'first_name' => $invitedUser->first_name,
                    'last_name' => $invitedUser->last_name,
                    'avatar_id' => $userGameData->avatar_id,
                    'created_at' => $invitedUser->created_at,
                ];
            }
        }
        $balance = $userGameData->balance ?? 0; // Example: Use `0` if balance is not set

        return response()->json([
            'referred_friends' => $referredFriends,
            'balance' => $balance,
        ]);
    }
}