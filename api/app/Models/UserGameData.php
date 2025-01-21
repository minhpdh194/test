<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\FriendsInvitation;
use Carbon\Carbon;

class UserGameData extends Model
{
    use HasFactory;
    protected $table = "user_game_data";
    protected $guarded = [];
    protected $casts = [
        'last_login_date' => 'datetime',
        'total_pnl' => 'array'
    ];

    public function updateInviterUserBalance()
    {
        $increasedBalance = 0;

        $referralData = FriendsInvitation::where(['inviter_id' => $this->telegram_user_id, 'has_connected' => true])->get();

        if ($referralData) {
            $increasedBalance += 20_000;

            $nb_invitees = count($referralData);

            if ($nb_invitees == 3) $increasedBalance += 25_000;
            else if ($nb_invitees == 6) $increasedBalance += 50_000;
            else if ($nb_invitees == 10) $increasedBalance += 100_000;
            else if ($nb_invitees == 25) $increasedBalance += 250_000;
            else if ($nb_invitees == 50) $increasedBalance += 500_000;
            else if ($nb_invitees == 100) $increasedBalance += 1_000_000;

            $this->balance += $increasedBalance;
            $this->amount_of_tokens += $increasedBalance;
            $this->save();
        }
        return $increasedBalance;
    }

    public function updateInviteeUserBalance()
    {
        $this->balance += 20_000;
        $this->amount_of_tokens += 20_000;
        $this->save();
    }

    public function restoreEnergy($maxEnergy, $last_login)
    {
        $freq = Carbon::parse($last_login)->diffInHours(Carbon::now());
        if ($freq > 3) $freq = 3;
        if ($maxEnergy <= 0) {
            $maxEnergy = 1;
        }
        $restoredEnergy = floor($freq / 3 * $maxEnergy);
        $this->available_energy += $restoredEnergy;
        $this->save();
    }
}
