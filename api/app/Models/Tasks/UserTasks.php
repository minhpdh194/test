<?php

namespace App\Models\Tasks;

use Illuminate\Database\Eloquent\Model;

use App\Models\Tasks\DailyTask;

class UserTasks extends Model
{
    protected $guarded = [];
    protected $table = "user_tasks";
}
