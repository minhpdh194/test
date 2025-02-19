<?php

use App\Http\Controllers\BonusController;
use App\Http\Controllers\TelegramBonusController;
use App\Http\Controllers\TelegramStarController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ClickerController;
use App\Http\Controllers\UserTaskController;
use App\Http\Controllers\PositionController;


Route::prefix('clicker')->group(function () {
    Route::get('/sync', [ClickerController::class, 'sync']);
    Route::post('/tap', [ClickerController::class, 'tap']);

    Route::get('/get-position-ratios', [PositionController::class, 'getPositionRatios']);

    // Daily tasks
    Route::get('/daily-tasks', [ClickerController::class, 'listDailyTasks']);
    Route::post('/claim-daily-task', [ClickerController::class, 'claimDailyTaskReward']);

    // Regular tasks
    Route::get('/tasks', [UserTaskController::class, 'index']);
    Route::post('/tasks/{task}', [UserTaskController::class, 'store']);
    Route::post('/tasks/{task}/claim', [UserTaskController::class, 'claim']);

    // Referral tasks
    // Route::get('/referral-tasks', [ReferralTaskController::class, 'index']);
    // Route::post('/referral-tasks/{task}/complete', [ReferralTaskController::class, 'complete']);

    // Leaderboard
    Route::get('/leaderboard', [ClickerController::class, 'listLeaderboard']);

    // Positions
    Route::get('/get-position', [PositionController::class,'getPositionsByUser']);
    Route::post('/add-position', [PositionController::class,'addPosition']);
    Route::post('/update-position', [PositionController::class, 'updatePosition']);
    Route::post('/close-position', [PositionController::class, 'closePosition']);

    // Daily booster (energy restore)
    Route::post('/use-daily-booster', [ClickerController::class, 'useDailyBooster']);

    // Set ton wallet
    Route::post('/set-eth-wallet', [ClickerController::class, 'setEthWallet']);
});

