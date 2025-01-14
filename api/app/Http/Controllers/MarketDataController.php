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
use App\Models\MarketData\Spot;

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

    public function getIndices()
    {
        $pairs = Pair::select('id')->get();
        $indices = [];

        foreach ($pairs as $pair) {
            $index = Index::where(['pair_id' => $pair->id, 'long_short' => 'long'])
                ->orderBy('created_at', 'desc')
                ->first();
                
            $indices[] = [
                'pair_id' => $pair->id,
                'long_short' => 'long',
                'value' => $index->value,
                'timestamp' => $index->created_at
            ];

            $index = Index::where(['pair_id' => $pair->id, 'long_short' => 'short'])
                ->orderBy('created_at', 'desc')
                ->first();

            $indices[] = [
                'pair_id' => $pair->id,
                'long_short' => 'short',
                'value' => $index->value,
                'timestamp' => $index->created_at
            ];
        }

        return response()->json($indices);
    }

    public function getSpots()
    {
        $latest_update = Spot::select('created_at')
            ->orderBy('created_at', 'desc')
            ->first()->created_at;
        $latest_spots = Spot::select('pair_id', 'day_open_value', 'prev_value', 'current_value', 'period_return')
            ->where('created_at', $latest_update)
            ->get();

        return response()->json($latest_spots);
    }

    public function getIndex(Request $request)
    {
        $validated = $request->validate([
            'pair_id' => 'required',
            'long_short' => 'required',
            'value_date' => 'required',
        ]);

        $index = Index::where(['pair_id' => $validated['pair_id'], 'long_short' => $validated['long_short']])
            ->where('created_at', Carbon::createFromTimestamp($validated['value_date']))
            ->first();

        if (!$index) {
            return response()->json(['error' => 'Index not found']);
        }

        return response()->json([
            'index' => $index->value,
        ]);
    }
}
