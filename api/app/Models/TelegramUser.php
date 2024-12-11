<?php

namespace App\Models;

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

    protected $casts = [
        'last_login_date' => 'datetime',
        'total_pnl' => 'array'
    ];

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
        $now = now();
        $freq = (now() - $this->last_login) / 3600;

        if ($freq > 12 && freq < 24) {
            $this->login_streak = $this->login_streak + 1;
        } else {
            $this->login_streak = 1;
        }

        $this->last_login = $now;
        $this->save();
    }
}
