<?php

namespace App\Http\Controllers;

use App\Models\MarketData\Index;
use App\Models\MarketData\Position;
use App\Models\MarketData\Spot;
use App\Models\MarketData\TotalOpenPositionValue;
use App\Models\TelegramUser;
use App\Models\UserBonuses;
use App\Models\UserGameData;
use App\Models\UserTransaction;
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
        $positions = $all->filter(function ($pos) {
            return $pos->alive;
        })->values();

        return response()->json([
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
            return response()->json('User not found', 404);
        }
        $userGameData = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();
        $validatedData = $request->only([
            'position',
            'bonus_end_dates'
        ]);

        $position = $validatedData['position'];

        $positionData['position_id'] = $position['position_id'];
        $positionData['amount'] = $position['amount'];

        $now = Carbon::now();
        $min_end_date = Carbon::createFromTimestamp($position['min_end_date']);

        /*****************
         * Sanity checks *
         * ***************/
        if ($position['amount'] > $userGameData->balance
            || $position['amount'] < 0
            || abs($now->diffInYears($min_end_date)) < 0.00065
            || $position['pair']['id'] > 25
            || $position['leverage'] > 10) return response()->json('Forbidden', 403);
        
        /*****************/

        $positionData['index_start'] = $position['index_at_start'];
        $positionData['average_leverage'] = $position['leverage'];
        $positionData['min_end_date'] = $min_end_date->toDateTimeString();
        $positionData['long_short'] = $position['long_short'];
        $positionData['telegram_user_id'] = $user->telegram_user_id;
        $positionData['pair_id'] = $position['pair']['id'];

        if (!empty($position['bonuses']) && count($position['bonuses']) > 0) {
            $bonuses_ids = array_map(fn($bonus) => (int)$bonus['id'], $position['bonuses']);
            $index = 0;

            // We update the user bonuses
            foreach ($bonuses_ids as $bonus_id) {
                $bonus = UserBonuses::where('id', $bonus_id)->first();
                $bonus->position_id = $positionData['position_id'];
                $bonus->end_date = Carbon::createFromTimestamp($validatedData['bonus_end_dates'][$index])->toDateTimeString();
                $bonus->save();

                $index++;
            }

            $positionData['bonuses_id'] = json_encode($bonuses_ids);
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
            $newBalance = $userGameData->balance - $positionData['amount'];
            $userGameData->balance = $newBalance;
            $userGameData->save();
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
        // new_bonus_ids is an array of bonus->id and their corresponding end_date
        // empty if no new bonus
        $new_bonus_ids = $request->get('new_bonuses');
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

        if (!empty($updated_position['bonuses']) && count($updated_position['bonuses']) > 0) {
            if (!empty($new_bonus_ids) && count($new_bonus_ids) > 0) {
                foreach ($new_bonus_ids as $new_bonus_id) {
                    $bonus = UserBonuses::where('id', $new_bonus_id['id'])->first();
                    $bonus->position_id = $updated_position['position_id'];
                    $bonus->end_date = Carbon::createFromTimestamp($new_bonus_id['end_date'])->toDateTimeString();
                    $bonus->save();
                }
            }

            $bonuses_ids = array_map(fn($bonus) => (int)$bonus['id'], $updated_position['bonuses']);
            $positionData['bonuses_id'] = json_encode($bonuses_ids);
        }

        $position->update($positionData);

        $userGameData->amount_of_tokens += $pnl;
        $userGameData->total_pnl += $pnl;
        $userGameData->perf_from_start_date += ($pnl / $position->amount);
        $userGameData->balance = $userGameData->balance - $position_change + $pnl;
        $userGameData->save();

        UserTransaction::create([
            'amount_of_tokens' => $pnl,
            'telegram_user_id' =>  $user->telegram_user_id,
        ]);

        return response()->json(['message' => 'Position updated successfully'], 200);
    }

    public function closePosition(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json('User not found', 404);
        }

        $position_id = $request->get('position')["position_id"];
        $pnl = $request->get('pnl');

        $position = Position::where(['position_id' => $position_id, 'telegram_user_id' => $user->telegram_user_id])
            ->first();

        $userGameData = UserGameData::where('telegram_user_id', $user->telegram_user_id)->first();

        if (!($position && $userGameData)) {
            return response()->json(['message' => 'Position not found'], 404);
        }

        $userGameData->balance += ($position->amount + $pnl);
        $userGameData->amount_of_tokens += $pnl;
        $userGameData->total_pnl += $pnl;
        $userGameData->perf_from_start_date += ($pnl / $position->amount);

        $userGameData->save();
        $position->delete();

        // We delete the bonuses which were attached
        $positionBonuses = UserBonuses::where(['telegram_user_id' => $user->telegram_user_id, 'position_id' => $position_id])->get();
        foreach ($positionBonuses as $bonus) {
            $bonus->delete();
        }

        UserTransaction::create([
            'amount_of_tokens' => $pnl,
            'telegram_user_id' =>  $user->telegram_user_id,
        ]);

        return response()->json(['message' => 'Position closed successfully'], 200);
    }
    
    private static function pnlIsNotConsistent($pair_id, $long_short, $amount, $initial_index, $declared_pnl)
    {
        $index = PositionController::getLastIndex($pair_id, $long_short);
        $estimated_pnl = $amount * ($index - $initial_index);

        if ($estimated_pnl * $declared_pnl < 0) return true;
        if ($estimated_pnl < 0) return $estimated_pnl < 1.1 * $declared_pnl;
        return $estimated_pnl > 1.1 * $declared_pnl;
    }

    private static function getLastIndex($pair_id, $long_short)
    {
        $index = Index::where(['pair_id' => $pair_id, 'long_short' => $long_short])
            ->orderBy('tokens', 'desc')
            ->first();

        return $index->value;
    }
}
