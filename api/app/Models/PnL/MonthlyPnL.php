<?php

namespace App\Models\PnL;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonthlyPnL extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "monthly_pnl";
}
