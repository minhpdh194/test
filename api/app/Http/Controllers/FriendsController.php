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
        $user = $request->user();
        $userId = $user->telegram_user_id;
        $referredFriends = [];
        $friends = FriendsInvitation::where(['inviter_id' => $userId, 'has_connected' => true])->get();

        if ($friends) {
            foreach ($friends as $friend) {
                $invitedUser = TelegramUser::where('telegram_user_id', $friend->invitee_id)->first();
                $avatar_id = UserGameData::select('avatar_id')->where('telegram_user_id', $userId)->first();

                $referredFriends[] = [
                    'telegram_id' => $invitedUser->telegram_user_id,
                    'first_name' => $invitedUser->first_name,
                    'last_name' => $invitedUser->last_name,
                    'avatar_id' => $avatar_id,
                    'created_at' => $invitedUser->created_at,
                ];
            }
        }

        return response()->json($referredFriends);
    }
}
