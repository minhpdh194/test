<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Observers\TelegramUserObserver;
use Laravel\Sanctum\HasApiTokens;

use App\Models\BonusDefinitions\LevelBonusesDef;
use App\Models\Tasks\DailyTask;
use App\Models\Tasks\ReferralTask;
use App\Models\Tasks\Task;
use App\Models\Tasks\UserDailyTasks;

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
            $freq = $now->diffInHours($this->last_login);

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

    public function tap($count = 1)
    {
        $getLevelUser = UserGameData::where('telegram_user_id', $this->telegram_user_id)->first();

        // $bonusDef = LevelBonusesDef::where('level', $getLevelUser->level)->first();

        // $earnPerTap = $bonusDef->gain_per_tap;
        $available_energy = $this->available_energy;
        $totalEnergyRequired = $count * $earnPerTap;

        if ($available_energy < $totalEnergyRequired) {
            return false;
        }

        $multiplier = $this->getActiveBoosterMultiplier();

        $earned = $count * $earnPerTap * $multiplier;

        $this->balance += $earned;

        $available_energy -= $totalEnergyRequired;
        $this->available_energy = $available_energy;

        $this->last_tap_date = now();

        $this->save();

        return $earned;
    }
}
