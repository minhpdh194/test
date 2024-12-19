<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FriendsController;
use App\Http\Controllers\MarketDataController;
use App\Http\Controllers\TelegramUserController;
use App\Http\Controllers\TelegramStarController;

use App\Http\Controllers\PopupController;

use App\Http\Controllers\PositionController;
use App\Http\Controllers\BonusController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/auth/telegram-user', [AuthController::class, 'telegramUser']);

Route::get('/popups', [PopupController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user_session', [AuthController::class, 'userSession']);
    Route::get('/referred-users', [FriendsController::class, 'referredUsers']);

    Route::get('/pairs', [MarketDataController::class, 'getPairs']);

    Route::get('/pairs-by-ids', [MarketDataController::class, 'getPairsByUnlockedIds']);

    Route::get('/user_positions', [PositionController::class, 'getPositions']);


    Route::post('/buy-stars', [TelegramStarController::class, 'buyStarPackage']);

    Route::post('/buy-bonus', [BonusController::class, 'buyBonus']);
    Route::get('/user_bonuses', [BonusController::class, 'getBonuses']);
    Route::post('/expire_bonuses', [BonusController::class, 'expiry']);

    require base_path('routes/clicker.php');

    Route::post('/update-user-level', [TelegramUserController::class, 'updateUserLevel']);
});

