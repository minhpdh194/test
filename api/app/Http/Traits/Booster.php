<?php

namespace App\Http\Traits;

use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

trait Booster
{
    public function buyBoosterPack(Request $request)
    {
        $request->validate([
            'booster_pack' => 'required|in:booster_pack_2x,booster_pack_3x,booster_pack_7x',
        ]);

        $user = $request->user();
        $boosterPack = $request->input('booster_pack');

        try {
            DB::transaction(function () use ($user, $boosterPack) {
                $currentTime = new DateTime();
                $boosterActiveUntil = new DateTime($user->booster_pack_active_until);

                if ($boosterActiveUntil > $currentTime) {
                    if ($this->isValidUpgrade($user, $boosterPack)) {
                        $this->deactivateCurrentBooster($user);
                    } else {
                        throw new \InvalidArgumentException("Cannot downgrade or repurchase the same booster pack while one is active.");
                    }
                }

                $this->activateBoosterPack($user, $boosterPack);
                $user->save();
            });

            return response()->json([
                'success' => true,
                'message' => 'Booster pack purchased successfully',
                'booster_pack_active_until' => $user->booster_pack_active_until,
                'balance' => $user->balance
            ]);
        } catch(\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while purchasing the booster pack.',
            ], 500);
        }
    }

    public function getBoosterCost($user, $boosterType)
    {
        $boostLevel = $boosterType === 'multi_tap' ? $user->multi_tap_level : $user->energy_limit_level;
        return 1 + ($boostLevel - 1);
    }

    public function buyBooster(Request $request)
    {
        $request->validate([
            'booster_type' => 'required|in:multi_tap,energy_limit',
        ]);

        $user = $request->user();
        $boosterType = $request->input('booster_type');
        $cost = $this->getBoosterCost($user, $boosterType);

        // if ($user->balance < $cost) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Not enough coins to buy this booster.',
        //         'required_coins' => $cost,
        //         'current_balance' => $user->balance,
        //     ], 400);
        // }

        try {
            DB::transaction(function () use ($user, $boosterType, $cost) {
                //$user->balance -= $cost;

                switch ($boosterType) {
                    case 'multi_tap':
                        $user->multi_tap_level++;
                        $user->earn_per_tap++;
                        break;
                    case 'energy_limit':
                        $user->energy_limit_level++;
                        break;
                    default:
                        throw new \InvalidArgumentException("Invalid booster type: {$boosterType}");
                }

                $user->save();
            });

            return response()->json([
                'success' => true,
                'message' => 'Booster purchased successfully',
                'balance' => $user->balance,
                'earn_per_tap' => $user->earn_per_tap,
                'multi_tap_level' => $user->multi_tap_level,
                'energy_limit_level' => $user->energy_limit_level,
                'next_multi_tap_cost' => $this->getBoosterCost($user, 'multi_tap'),
                'next_energy_limit_cost' => $this->getBoosterCost($user, 'energy_limit'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while purchasing the booster.',
            ], 500);
        }
    }

    public function useDailyBooster(Request $request)
    {
        $user = $request->user();

        if ($user->useDailyBooster()) {
            return response()->json([
                'success' => true,
                'message' => 'Daily booster used successfully',
                'current_energy' => $user->available_energy,
                'daily_booster_uses' => $user->daily_booster_uses,
                'next_available_at' => $user->last_daily_booster_use->addHour(),
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Cannot use daily booster at this time',
                'daily_booster_uses' => $user->daily_booster_uses,
                'next_available_at' => $user->last_daily_booster_use ? $user->last_daily_booster_use->addHour() : null,
            ], 400);
        }
    }

    private function getCurrentBoosterPack($user)
    {
        if ($user->booster_pack_7x) return 'booster_pack_7x';
        if ($user->booster_pack_3x) return 'booster_pack_3x';
        if ($user->booster_pack_2x) return 'booster_pack_2x';
        return null;
    }

    private function deactivateCurrentBooster($user)
    {
        $user->booster_pack_2x = 0;
        $user->booster_pack_3x = 0;
        $user->booster_pack_7x = 0;
    }

    private function activateBoosterPack($user, $boosterPack)
    {
        switch($boosterPack) {
            case 'booster_pack_2x':
                $user->booster_pack_2x = 1;
                break;
            case 'booster_pack_3x':
                $user->booster_pack_3x = 1;
                break;
            case 'booster_pack_7x':
                $user->booster_pack_7x = 1;
                break;
            default:
                throw new \InvalidArgumentException("Invalid booster pack type: {$boosterPack}");
        }
        $user->booster_pack_active_until = (new DateTime())->modify('+30 days')->format('Y-m-d H:i:s');
    }

    private function isValidUpgrade($user, $newPack)
    {
        $packValues = [
            'booster_pack_2x' => 2,
            'booster_pack_3x' => 3,
            'booster_pack_7x' => 7
        ];

        $currentPack = $this->getCurrentBoosterPack($user);
        if($currentPack) {
            return $packValues[$newPack] > $packValues[$currentPack];
        } else {
            return true;
        }
    }
}
