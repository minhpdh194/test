<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\UserTaskController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FriendsController;
use App\Http\Controllers\MarketDataController;
use App\Http\Controllers\TelegramUserController;
use App\Http\Controllers\TelegramStarController;


use App\Http\Controllers\PositionController;
use App\Http\Controllers\BonusController;

use App\Models\Settings;

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
Route::get('/total-stars', function () {
    $response = Settings::where('name', 'stars_spent')->first()->value;
    return response()->json(['total_stars' => $response]);
});
Route::post('/auth/telegram-user', [AuthController::class, 'telegramUser']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user_session', [AuthController::class, 'userSession']);
    Route::get('/referred-users', [FriendsController::class, 'referredUsers']);

    Route::post('/send-invoice', [TelegramStarController::class, 'sendInvoice']);

    Route::get('/top-users', [RatingController::class, 'getRating']);

    Route::get('/timestamp', function () {
        return response()->json(['timestamp' => Carbon\Carbon::now()->timestamp]);
    });

    Route::get('/pairs', [MarketDataController::class, 'getPairs']);
    Route::get('/pairs-by-ids', [MarketDataController::class, 'getPairsByUnlockedIds']);
    Route::get('/user_positions', [PositionController::class, 'getPositions']);

    Route::get('/get-indices', [MarketDataController::class,'getIndices']);
    Route::get('/get-index', [MarketDataController::class,'getIndex']);
    Route::get('/load-spots', [MarketDataController::class,'getSpots']);

    Route::post('/buy-stars', [TelegramStarController::class, 'buyStarPackage']);

    Route::post('/buy-bonus', [BonusController::class, 'buyBonus']);
    Route::get('/user_bonuses', [BonusController::class, 'getBonuses']);
    Route::post('/expiry_bonuses', [BonusController::class, 'expiry']);

    Route::post('/update-user-avatar', [TelegramUserController::class, 'updateUserAvatar']);

    require base_path('routes/clicker.php');

    Route::post('/update-user-level', [TelegramUserController::class, 'updateUserLevel']);

    Route::post('/claim-task', [UserTaskController::class, 'claimTask']);
    Route::post('/receive-task', [UserTaskController::class, 'receiveTask']);
    Route::get('/get-user-inprogress-task', [UserTaskController::class, 'getUserInProgressTasks']);
    Route::get('/get-user-completed-task', [UserTaskController::class, 'getUserCompletedTasks']);

    Route::post('/buy-token', [BonusController::class, 'buyToken']);
    Route::get('/get-left-users', [RatingController::class, 'getLeftUsers']);
});

