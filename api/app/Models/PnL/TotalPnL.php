<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TotalPnL extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $table = "total_pnl";
}
