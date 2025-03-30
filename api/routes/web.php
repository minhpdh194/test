<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\FriendsController;
use App\Http\Controllers\MarketDataController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TelegramUserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PairSymbolController;

Route::get('/', function () {
    return view('welcome');
});
// Route::group(['prefix' => 'pair', 'as' => 'pair.'], function () {
//     Route::controller(PairSymbolController::class)->group(function () {
//         Route::get('fetch', 'binanceData');
//     });
// });
Route::get('/invite-user', [FriendsController::class, 'redirectFriendInvitation']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/tasks', [AdminController::class, 'tasks'])->name('tasks');
    Route::get('/tasks/create', [AdminController::class, 'createTask'])->name('create_task');
    Route::post('/tasks', [AdminController::class, 'storeTask'])->name('store_task');
    Route::get('/daily-tasks', [AdminController::class, 'dailyTasks'])->name('daily_tasks');
    Route::get('/daily-tasks/create', [AdminController::class, 'createDailyTask'])->name('create_daily_task');
    Route::post('/daily-tasks/store', [AdminController::class, 'storeDailyTask'])->name('store_daily_task');
});
// Route::get('/price', [TelegramUserController::class, 'getTrading']);
// Route::get('/volatility', [TelegramUserController::class, 'fetchVolatilities']);
// Route::get('/get-volatility', [TelegramUserController::class, 'integration']);

// Route::get('/get-volatility', [MarketDataController::class, 'integration']);
// Route::get('/get-all-spots', [MarketDataController::class, 'getSpotsFromMarket']);

require __DIR__ . '/auth.php';
