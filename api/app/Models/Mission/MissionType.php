<?php

namespace App\Models\Mission;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MissionType extends Model
{
    use HasFactory;

    protected $table = "mission_types";

    protected $guarded  = [];
}
