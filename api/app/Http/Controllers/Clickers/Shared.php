<?php

namespace App\Http\Controllers\Clickers;

trait Shared
{
    public static function getBoosterCost($user, $boosterType)
    {
        $boostLevel = $boosterType === 'multi_tap' ? $user->multi_tap_level : $user->energy_limit_level;
        return 1 + ($boostLevel - 1);
    }
}