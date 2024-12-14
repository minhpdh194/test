<?php

namespace App\Http\Controllers;

use App\Http\Traits\MarketData;
use App\Models\MarketData\Fixing;
use App\Models\MarketData\Pair;
use App\ServerTasks\MarketDataTasks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class MarketDataController extends Controller
{
    private $marketData;

    public function __construct(MarketDataTasks $marketData) {
        $this->marketData = $marketData;
    }

    public function integration() {
        return $this->marketData->integration();
    }

    // Gets the latest fixings for user to update its positions
    // and compute PnL
    public function getFixings()
    {
        $fixings = Fixing::with('fixing');
        return response()->json($fixings);
    }

    // Get the pairs definitions registered in the database
    public function getPairs()
    {
        $pairs = Pair::select('id', 'pair_symbol')->get();
        return response()->json($pairs);
    }
}
