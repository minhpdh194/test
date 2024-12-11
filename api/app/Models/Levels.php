<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Levels extends Model
{
    use HasFactory;

    public function users()
    {
        return $this->hasMany(TelegramUser::class);
    }

    private static $levels = [

    ];

    public static function max()
    {
        return end(self::$levels);
    }
}
