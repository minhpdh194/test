<?php

namespace App\Models\MarketData;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\MarketData\Pair;
use App\Models\MarketData\VolAndFwd;

class Spot extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $table = "historical_spots";
    protected $fillable = ['created_at'];

    public function volatility()
    {
        return $this->belongsTo(VolAndFwd::class, 'pair_id', 'pair_id')
                    ->latest()
                    ->select('pair_id', 'yield', 'forward', 'volatility');
    }

    public function pair()
    {
        return $this->belongsTo(Pair::class, 'pair_id', 'id');
    }
}
