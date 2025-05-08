<?php

namespace App\Models\PnL;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeeklyPnl extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "weekly_pnl";
}
