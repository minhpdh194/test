<?php

namespace App\Http\Controllers;

use App\Models\MarketData\Position;
use App\Models\MarketData\Spot;
use App\Models\MarketData\TotalOpenPositionValue;
use App\Models\TelegramUser;
use App\Models\UserBonuses;
use App\Models\UserGameData;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PositionController extends Controller
{
    private $fixingService;
    private $positionService;
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function getPositions(Request $request)
    {
        $all = Position::where('telegram_user_id', $request->user()->telegram_user_id)->get();
        $next_position_id = $all->count() + 1;
        $positions = $all->filter(function ($pos) { return $pos->alive; })->values();

        return response()->json([
            'next_position_id' => $next_position_id,
            'positions' => $positions
        ]);
    }

    public function getPositionRatios()
    {
        $perviousTotalLongPositionAmount = TotalOpenPositionValue::select('pair_id', 'prev_total_long_value')->get();
        $perviousTotalShortPositionAmount = TotalOpenPositionValue::select('pair_id', 'prev_total_short_value')->get();
        $currentTotalLongPositionAmount = TotalOpenPositionValue::select('pair_id', 'current_total_long_value')->get();
        $currentTotalShortPositionAmount = TotalOpenPositionValue::select('pair_id', 'current_total_short_value')->get();
        return response()->json(['current_total_long_position' => $currentTotalLongPositionAmount, 'current_total_short_position' => $currentTotalShortPositionAmount, 'prev_total_long_position' => $perviousTotalLongPositionAmount, 'prev_total_short_position' => $perviousTotalShortPositionAmount]);
    }

    public function getPositionsByUser(Request $request)
    {
        $positions = Position::where('telegram_user_id', $request->user()->id)->get();
        return response()->json($positions);
    }

    public function addPosition(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(null);
        }
        $userGameData = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();
        $validatedData = $request->only([
            'position_id',
            'pair',
            'long_short',
            'amount',
            'index_at_start',
            'leverage',
            'bonuses',
            'min_end_date',
        ]);

        $positionData['position_id'] = $validatedData['position_id'];
        $positionData['amount'] = $validatedData['amount'];
        $positionData['index_start'] = $validatedData['index_at_start'];
        $positionData['average_leverage'] = $validatedData['leverage'];
        $positionData['min_end_date'] = Carbon::createFromTimestamp($validatedData['min_end_date'])->toDateTimeString();
        $positionData['long_short'] = $validatedData['long_short'];
        $positionData['telegram_user_id'] = $user->telegram_user_id;
        $positionData['pair_id'] = $validatedData['pair']['id'];

        if (!empty($validatedData['bonuses']) && count($validatedData['bonuses']) > 0) {
            $bonuses_id = array_map(fn($bonus) => (string) $bonus['id'], $validatedData['bonuses']);
            $positionData['bonuses_id'] = json_encode($bonuses_id);
        }
        $totalPositionValue = TotalOpenPositionValue::where('pair_id', $positionData['pair_id'])->first();
        if (!$totalPositionValue) {
            $totalPositionValue = TotalOpenPositionValue::create([
                'pair_id' => $positionData['pair_id'],
            ]);
        }

        if ($positionData['long_short'] === 'long') {
            $totalPositionValue->total_long_value += $positionData['amount'];
        } else {
            $totalPositionValue->total_short_value += $positionData['amount'];
        }
        $totalPositionValue->save();

        $position = Position::create(
            $positionData
        );

        if ($userGameData) {
            $newBalance = $userGameData->balance - $validatedData['amount'];
            $userGameData->balance = $newBalance;
            $userGameData->save();
        }

        if (isset($validatedData['bonuses']) && is_array($validatedData['bonuses']) && count($validatedData['bonuses']) > 0) {
            $this->positionService->addBonuses($validatedData['bonuses'], $userGameData->id, $position->id);
        }

        return response()->json([
            'message' => 'Position created successfully',
            'data' => $position,
        ], 201);
    }

    public function updatePosition(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json('User not found', 404);
        }

        $updated_position = $request->get('position');
        $pnl = $request->get('pnl');

        $position = Position::where(['position_id' => $updated_position['position_id'], 'telegram_user_id' => $user->telegram_user_id])->first();
        $userGameData = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();

        if (!$position || !$userGameData) {
            $pos_issue = !$position;
            return response()->json(['message' => 'Position not found'], 404);
        }

        $position_change = $updated_position['amount'] - $position->amount;

        $positionData['amount'] = $updated_position['amount'];
        $positionData['index_start'] = $updated_position['index_at_start'];
        $positionData['average_leverage'] = $updated_position['leverage'];
        $positionData['long_short'] = $updated_position['long_short'];
        $positionData['min_end_date'] = Carbon::createFromTimestamp($updated_position['min_end_date'])->toDateTimeString();
        $positionData['alive'] = $updated_position['amount'] != 0;

        $position->update($positionData);

        $userGameData->amount_of_tokens += $pnl;
        $userGameData->total_pnl += $pnl;
        $userGameData->perf_from_start_date += ($pnl / $position->amount);
        $userGameData->balance = $userGameData->balance - $position_change + $pnl;
        $userGameData->save();

        return response()->json(['message' => 'Position updated successfully'], 200);
    }

    public function closePosition(Request $request)
    {
        $user = $request->user();

        $position_id = $request->get('position')["position_id"];
        $pnl = $request->get('pnl');

        $position = Position::where(['position_id' => $position_id, 'telegram_user_id' => $user->telegram_user_id])
            ->first();

        $userGameData = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();

        if (!$position || !$userGameData) {
            $pos_issue = !$position;
            return response()->json(['message' => 'Position not found'], 404);
        }

        // We delete the bonuses which were attached
        $positionBonuses = UserBonuses::where('position_id', $position_id)->get();
        foreach ($positionBonuses as $bonus) {
            $bonus->delete();
        }

        $userGameData->balance += ($position->amount + $pnl);
        $userGameData->amount_of_tokens += $pnl;
        $userGameData->total_pnl += $pnl;
        $userGameData->perf_from_start_date += ($pnl / $position->amount);

        $userGameData->save();
            $position->delete();

        \Log::info('Position deleted successfully');
            return response()->json(['message' => 'Position closed successfully'], 200);
        }
}