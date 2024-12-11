<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $routeMiddleware = [
        'cors' => \App\Http\Middleware\Cors::class
    ];

    /**
     * Đăng ký các lệnh Artisan của bạn.
     *
     * @return void
     */
    protected $commands = [
        \App\Console\Commands\RunCheckResultPositionJob::class,
    ];
    /**
     * Định nghĩa các lịch trình của console.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('app:run-check-result-position-job')->hourly();
    }

    /**
     * Đăng ký các lệnh Artisan.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
    }
}
