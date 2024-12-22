<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Đăng ký các lệnh Artisan của bạn.
     *
     * @return void
     */
    protected $commands = [
        \App\Console\Commands\RunCheckResultPositionJob::class,
        \App\Console\Commands\Integration::class,
    ];
    /**
     * Định nghĩa các lịch trình của console.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('app:run-check-result-position-job')->hourly();
        $schedule->command('app:integration')->everyMinute();
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
