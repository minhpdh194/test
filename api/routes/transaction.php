<?php

use App\Http\Controllers\BonusController;
use App\Http\Controllers\TelegramStarController;
use Illuminate\Support\Facades\Route;

Route::prefix('transaction')->group(function () {
    Route::post('/buy-stars', [TelegramStarController::class, 'buyStarPackage']);

    Route::post('/buy-bonus', [BonusController::class, 'buyBonus']);
});
