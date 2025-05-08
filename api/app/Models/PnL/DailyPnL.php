<?php

namespace App\Models\PnL;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyPnL extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "daily_pnl";
}
