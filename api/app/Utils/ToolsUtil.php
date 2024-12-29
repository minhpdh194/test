<?php

namespace App\Utils;

use Carbon\Carbon;

class ToolsUtil
{
    public static function getPairSymbol($coin, $base)
    {
        return "{$coin}/{$base}";
    }

    // We use this function to make sure that all users are sync with the server
    public static function getFixingTimestamp()
    {
        $ts = Carbon::now()->timestamp;
        $fixing = (int)($ts / 120) * 120;

        // We assume that fixing will always be done around time % 2min = 0
        if ($ts > $fixing + 110) $fixing += 120;

        return $fixing;
    }
}
