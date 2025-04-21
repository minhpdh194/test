<?php

namespace App\Console\Commands;

use App\Services\PnLRankingService;
use Illuminate\Console\Command;

class RankingComputation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:ranking-computation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(PnLRankingService $service)
    {
        sleep(30);
        $service->calculatePnlUpdate();
    }
}
