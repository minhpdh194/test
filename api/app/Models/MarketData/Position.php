<?php

namespace App\Models\MarketData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $table = "positions";

    protected $guarded  = [];

}
