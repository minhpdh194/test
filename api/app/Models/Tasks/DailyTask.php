<?php

namespace App\Models\Tasks;

use Illuminate\Database\Eloquent\Model;

class DailyTask extends Model
{
    protected $guarded = [];
    protected $table = "daily_tasks";

    public function getTask($id)
    {
        
    }
}
