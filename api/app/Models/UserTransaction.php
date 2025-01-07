<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTransaction extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "user_transaction";

    public function userData()
    {
        return $this->belongsTo(TelegramUser::class, 'telegram_user_id', 'telegram_user_id');
    }
}
