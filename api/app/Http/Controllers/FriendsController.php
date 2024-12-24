<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\FriendsInvitation;
use App\Models\TelegramUser;
use App\Models\UserGameData;

class FriendsController extends Controller
{
    // Gets the latest fixings for user to update its positions
    // and compute PnL
    public function referredUsers(Request $request)
    {
        $userId = $request->user()->id;
        $referredFriends = [];
        $friends = FriendsInvitation::where(['inviter_id' => $userId, 'has_connected' => true])->get();

        if ($friends) {
            foreach ($friends as $friend) {
                $user = TelegramUser::where('telegram_user_id', $friend->invitee_id)->first();
                $avatar_id = UserGameData::select('avatar_id')->where('telegram_user_id', $user->telegram_user_id)->first();

                $referredFriends[] = [
                    'id' => $user->id,
                    'telegram_id' => $user->telegram_user_id,
                    'username' => $user->username,
                    'avatar_id' => $avatar_id
                ];
            }
        }

        return response()->json($referredFriends);
    }
}