<?php

namespace App\Http\Controllers;

use App\Models\MarketData\Fixing;
use App\Models\MarketData\Position;
use App\Models\MarketData\Spot;
use App\Models\TelegramUser;
use App\Models\UserProfile;
use App\Models\MarketData\TotalOpenPositionValue;

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
    public function __construct(PositionService $positionService, FixingService $fixingService)
    {
        $this->positionService = $positionService;
        $this->fixingService = $fixingService;
    }

    public function getPositions($userId)
    {
        $all = Position::where('user_id', $userId)->get();
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
        $userProfile = UserProfile::where('telegram_user_id', $user->id)->first();
        $getTrading = Spot::where('pair_id', $request->pair['pair']['id'])->latest()->first();
        $validatedData = $request->only([
            'pair.id',
            'pair.pair.pair_symbol',
            'pair',
            'long_short',
            'amount',
            'leverage',
            'bonuses',
            'min_end_date',
            'userId',
            'total_open_position'
        ]);

        $positionData['position_id'] = $validatedData['pair']['pair_id'];
        $positionData['pair_symbol'] = $validatedData['pair']['pair']['pair_symbol'];
        $positionData['amount'] = $validatedData['amount'];
        $positionData['average_leverage'] = $validatedData['leverage'];
        $positionData['min_end_date'] = Carbon::createFromTimestamp($validatedData['min_end_date'])->toDateTimeString();
        $positionData['open_return'] = $validatedData['pair']['return'];
        $positionData['long_short'] = $validatedData['long_short'];
        $positionData['user_id'] = $userProfile->id;

        if (!empty($validatedData['bonuses'])) {
            $bonuses_id = array_map(fn($bonus) => (string) $bonus['id'], $validatedData['bonuses']);
            $positionData['bonuses_id'] = json_encode($bonuses_id);
        }

        $totalPositionValue = TotalOpenPositionValue::where('pair_id', $positionData['position_id'])->first();
        if (!$totalPositionValue) {
            $totalPositionValue = TotalOpenPositionValue::create([
                'pair_id' => $positionData['position_id'],
                'pair_symbol' => $positionData['pair_symbol'],
                'current_total_long_value' => 0,
                'current_total_short_value' => 0
            ]);
        }
        
        if ($positionData['long_short'] === 'long') {
            $totalPositionValue->current_total_long_value += $positionData['amount'];
        } else {
            $totalPositionValue->current_total_short_value += $positionData['amount'];
        }
        $totalPositionValue->save();

        // $matchVol = $getTrading->volatility;
        // if ($matchVol != null) {
        //     if ($matchVol->volatility != 0) {
        //         $optionPremium = $this->fixingService->getOptionPremium($getTrading->value, $matchVol->forward, $matchVol->volatility);
        //         $latestFixing = Fixing::where('symbol', $matchVol->pair_symbol)->orderBy('created_at', 'desc')->first();
        //         $fixing = Fixing::create([
        //             'spot' => $getTrading->value,
        //             'option_premium' => $optionPremium,
        //             'symbol' => $matchVol->pair_symbol,
        //         ]);

        //         $this->fixingService->updateTotalAmountPositions($fixing, $positionData['long_short'], $positionData['amount'], $latestFixing);
        //     }
        // }

        $position = Position::create(
            $positionData
        );

        if ($user) {
            $newBalance = $user->balance - $validatedData['amount'];
            $user->balance = $newBalance;
            $user->save();
        }

        if (isset($validatedData['bonuses']) && is_array($validatedData['bonuses'])) {
            $this->positionService->addBonuses($validatedData['bonuses'], $userProfile->id, $position->id);
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
        Log::info('Close position request: ', ['request' => $request->all()]);
        $user = $request->user();
        $telegramUser = TelegramUser::where('id', $user->id)->first();

        $position_id = $request->position_id;
        $position = Position::where('id', $position_id)
            ->where('user_id', $telegramUser->id)
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
