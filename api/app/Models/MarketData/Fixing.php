<?php

namespace App\Models\MarketData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fixing extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $table = "fixings";

    // Get all pairs
    public function fixing()
    {
        return $this->belongsTo(Fixing::class, 'pair_sympol');
    }
}
