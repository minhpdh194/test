<?php

namespace App\Models\Tasks;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\TelegramUser;

class CompletedTask extends Model
{
    use HasFactory;

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(TelegramUser::class);
    }
}
