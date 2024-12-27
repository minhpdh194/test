<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

use App\ServerTasks\MarketDataTasks;

use App\Http\Traits\MarketData;
use App\Models\MarketData\Fixing;
use App\Models\MarketData\Pair;
use App\Models\MarketData\Index;

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

    public function getIndexPerf(Request $request)
    {
        $validated = $request->validate([
            'pair_id' => 'required',
            'long_short' => 'required',
            'from' => 'required',
            'to' => 'required'
        ]);

        $index_start = Index::where(['pair_id' => $validated['pair_id'], 'long_short' => $validated['long_short']])
            ->where('created_at', $validated['from'])
            ->first();

        $index_end = Index::where(['pair_id' => $validated['pair_id'], 'long_short' => $validated['long_short']])
            ->where('created_at', $validated['to'])
            ->first();

        if (!$index_start || !$index_end) {
            return response()->json(['error' => 'Index not found']);
        }

        $indexPerf = [
            'perf' => $index_end->value - $index_start->value
        ];

        return response()->json($indexPerf);
    }
}
