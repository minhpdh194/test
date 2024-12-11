<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FriendsInvitation extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "friends_invitations";

    public function update()
    {
        $this->has_connected = true;
        $this->save();
    }
}
