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
        return $this->belongsTo(UserGameData::class, 'telegram_user_id', 'telegram_user_id');
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

    public static function tap($count = 1, $updateTime, $gameData, $earnPerTap)
    {
        $gameData->available_energy += TelegramUser::restoreEnergy($updateTime, $gameData->energy_limit, $gameData->last_tap);
        if ($gameData->available_energy > $gameData->energy_limit) $gameData->available_energy = $gameData->energy_limit;

        $totalEnergyRequired = $count * $earnPerTap;

        // We allow only to tap until remaining energy is empty
        if ($gameData->available_energy < $totalEnergyRequired) {
            $count = floor($gameData->available_energy / $earnPerTap);
            $totalEnergyRequired = $count * $earnPerTap;
        }

        $multiplier = 1;
        $earned = $totalEnergyRequired * $multiplier;

        $gameData->balance += $earned;
        $gameData->amount_of_tokens += $earned;
        $gameData->available_energy -= $totalEnergyRequired;
        $gameData->last_tap = $updateTime;
        $gameData->save();

        return [
            'earned' => $earned,
            'balance' => $gameData->balance,
            'amount_of_tokens' => $gameData->amount_of_tokens,
            'energy' => $gameData->available_energy
        ];
    }

    public static function restoreEnergy($update_time, $maxEnergy, $last_tap)
    {
        $freq = abs($update_time->diffInMinutes(Carbon::parse($last_tap)));
        if ($freq > 180) $freq = 180;
        return ceil($freq / 180.0 * $maxEnergy);
    }
}
