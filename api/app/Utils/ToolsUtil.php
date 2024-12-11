<?php

namespace App\Utils;

class ToolsUtil
{
    public static function getPairSymbol($coin, $base)
    {
        return "{$coin}/{$base}";
    }
}
