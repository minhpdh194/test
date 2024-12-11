<?php

namespace App\Models\MarketData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pair extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $table = "pairs";

    // Get all pairs
    public function pairs()
    {
        return $this->belongsTo(Pair::class, 'id');
    }
}
