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
    //public function __construct(PositionService $positionService, FixingService $fixingService)
    //{
    //    $this->positionService = $positionService;
    //    $this->fixingService = $fixingService;
    //}

    public function getPositions(Request $request)
    {
        $all = Position::where('user_id', $request->user()->telegram_user_id)->get();
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
        $positions = Position::where('user_id', $request->user()->id)->get();
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
            'pair',
            'long_short',
            'amount',
            'leverage',
            'bonuses',
            'min_end_date',
        ]);

        $positionData['amount'] = $validatedData['amount'];
        $positionData['average_leverage'] = $validatedData['leverage'];
        $positionData['min_end_date'] = Carbon::createFromTimestamp($validatedData['min_end_date'])->toDateTimeString();
        $positionData['long_short'] = $validatedData['long_short'];
        $positionData['user_id'] = $user->telegram_user_id;
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

        $userProfile = TelegramUser::where('id', $user->id)->first();

        $validatedData = $request->only([
            'id',
            'pair',
            'position_id',
            'long_short',
            'amount',
            // 'pnl',
            'leverage',
            // 'open_date',
            'bonuses',
            // 'min_end_date',
            'userId',
        ]);

        $position = Position::where('id', $validatedData['id'])
            ->where('user_id', $userProfile->id)
            ->first();

        if (!$position) {
            return response()->json(['message' => 'Position not found'], 404);
        }

        $positionData['amount'] = $validatedData['amount'];
        $positionData['average_leverage'] = $validatedData['leverage'];
        $positionData['long_short'] = $validatedData['long_short'];
        // $positionData['performance'] = $validatedData['performance'];
        // $positionData['min_end_date'] = $validatedData['id'];

        if (isset($validatedData['bonuses']) && is_array($validatedData['bonuses'])) {
            $this->positionService->addBonuses($validatedData['bonuses'], $userProfile->id, $position->id);
        }

        $position->update($positionData);
        return response()->json(['message' => 'Position updated successfully'], 200);
    }

    public function closePosition(Request $request)
    {
        Log::info($request);
        $user = $request->user();

        $position_id = $request->position_id;
        $position = Position::where('id', $position_id)
            ->where('user_id', $user->telegram_user_id)
            ->first();

        $positionBonuses = UserBonuses::where('position_id', $position_id)->get();
        foreach ($positionBonuses as $bonus) {
            $bonus->delete();
        }

        if ($position) {
            $position->delete();
            Log::info('Position deleted successfully');
            return response()->json(['message' => 'Position closed successfully'], 200);
        }

        return response()->json(['message' => 'Position closed successfully'], 201);
    }
}
