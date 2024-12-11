<?php

namespace App\Models\BonusDefinitions;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BonusDef extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "bonus_def";
}
