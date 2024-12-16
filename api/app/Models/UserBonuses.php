<?php

namespace App\Models;

use App\Models\BonusDefinitions\BonusDef;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBonuses extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "user_bonuses";
}
