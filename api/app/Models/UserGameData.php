<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\FriendsInvitation;

class UserGameData extends Model
{
    use HasFactory;
    protected $table = "user_game_data";
    protected $guarded = [];
    protected $casts = [
        'last_login_date' => 'datetime',
        'total_pnl' => 'array'
    ];

    public function referralUpdate()
    {
        $referralData = FriendsInvitation::where(['inviter_id' => $this->telegram_user_id, 'has_connected' => true])->get();

        if ($referralData) {
            $nb_invitees = count($referralData);

            if ($nb_invitees == 3) $this->balance += 25_000;
            else if ($nb_invitees == 6) $this->balance += 50_000;
            else if ($nb_invitees == 10) $this->balance += 100_000;
            else if ($nb_invitees == 25) $this->balance += 250_000;
            else if ($nb_invitees == 50) $this->balance += 500_000;
            else if ($nb_invitees == 100) $this->balance += 1_000_000;

            $this->save();
        }
    }
}
