<?php

namespace App\Models\Tasks;

use App\Models\TelegramUser;
use Illuminate\Database\Eloquent\Model;

class Tasks extends Model
{
    protected $guarded = [];
    protected $table = "tasks";

    public function getImageAttribute($value)
    {
        return $value ? env("APP_STORAGE_URL", "/") . 'storage/' . $value : null;
    }

    public function telegramUsers()
    {
        return $this->belongsToMany(TelegramUser::class, 'telegram_user_tasks')
            ->withPivot('status', 'rewarded')
            ->withTimestamps();
    }
}
