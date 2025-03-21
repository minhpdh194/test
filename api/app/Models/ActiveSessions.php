<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActiveSessions extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "sessions";

    // public function update($chatId = []) {
    //     $this->chat_id = $chatId;
    //     $this->last_activity = now();

    //     $this->save();
    // }
}
