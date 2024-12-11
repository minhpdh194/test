<?php

namespace App\Models\Mission;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MissionLevel extends Model
{
    use HasFactory;

    protected $table = "mission_level";

    protected $guarded  = [];
}
