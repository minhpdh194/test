<?php

namespace App\Models\BonusDefinitions;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LevelBonusesDef extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $table = "level_bonuses_def";
}
