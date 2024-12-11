<?php

namespace App\Models\MarketData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VolAndFwd extends Model
{
    use HasFactory;
    protected $table = "vol_fwd";
    protected $guarded = [];
}
