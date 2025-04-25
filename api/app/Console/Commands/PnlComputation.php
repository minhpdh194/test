<?php

namespace App\Console\Commands;

use App\ServerTasks\MarketDataTasks;
use Illuminate\Console\Command;

class PnlComputation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:pnl-computation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(MarketDataTasks $task)
    {
        $task->pnlComputation();
    }
}
