<?php

namespace App\Models\MarketData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TotalOpenPositionValue extends Model
{
    use HasFactory;

    protected $table = "total_open_position_value";

    protected $guarded = [];

    protected $fillable = [
        'pair_id',
        'prev_total_long_value',
        'prev_total_short_value',
        'current_total_long_value',
        'current_total_short_value',
    ];
}
