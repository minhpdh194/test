<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Observers\TelegramUserObserver;
use Laravel\Sanctum\HasApiTokens;

#[ObservedBy(TelegramUserObserver::class)]
class TelegramUser extends Authenticatable
{
    use HasApiTokens;

    protected $guarded = [];

    // protected $fillables = ['bonus'];
    use HasFactory;
    protected $table = "user_profile";

    protected $hidden = [
        'remember_token',
    ];

    // protected $casts = [
    //     'last_login_date' => 'datetime',
    //     'total_pnl' => 'array'
    // ];

    public function userProfiles()
    {
        return $this->belongsTo(TelegramUser::class, 'telegram_user_id', 'id');
    }

    public function level()
    {
        return $this->belongsTo(Levels::class, 'level_id', 'id');
    }

    public function updateLoginStreak()
    {
        $now = Carbon::now();

        if ($this->last_login) {
            $freq = Carbon::parse($this->last_login)->diffInHours($now);

            if ($freq > 12 && $freq < 24) {
                $this->login_streak = $this->login_streak + 1;
            } else {
                $this->login_streak = 1;
            }
        } else {
            // If no last login date exists, start the login streak
            $this->login_streak = 1;
        }

        $this->last_login = $now;
        $this->save();
    }

    public function tap($count = 1, $earnPerTap)
    {
        $userGameData = UserGameData::where('telegram_user_id', $this->telegram_user_id)->first();

        $available_energy = $gameData->available_energy + $this->restoreEnergy($gameData->energy_limit, $user->last_login);
        if ($available_energy > $gameData->energy_limit) $available_energy = $gameData->energy_limit;

        $totalEnergyRequired = $count * $earnPerTap;

        // We allow only to tap until remaining energy is empty
        if ($available_energy < $totalEnergyRequired) {
            $totalEnergyRequired = $available_energy;
            $count = $totalEnergyRequired / $earnPerTap;
        }

        // $multiplier = $this->getActiveBoosterMultiplier();
        $multiplier = 1;

        $earned = $totalEnergyRequired * $multiplier;

        $userGameData->balance += $earned;
        $userGameData->amount_of_tokens += $earned;
        $userGameData->available_energy -= $totalEnergyRequired;

        $userGameData->save();
        return [
            'earned' => $earned,
            'balance' => $userGameData->balance,
            'amount_of_tokens' => $userGameData->amount_of_tokens,
            'energy' => $userGameData->available_energy
        ];
    }
}
