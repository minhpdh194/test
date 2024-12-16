<?php

namespace App\Models\MarketData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TotalOpenPositionValue extends Model
{
    use HasFactory;

    protected $table = "total_open_positions";

    protected $guarded = [];
}
