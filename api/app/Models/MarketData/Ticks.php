<?php

namespace App\Models\MarketData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticks extends Model
{
    use HasFactory;

    protected $table = "ticks";

    protected $guarded  = [];

}