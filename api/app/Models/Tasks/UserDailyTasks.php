<?php

namespace App\Models\Tasks;

use Illuminate\Database\Eloquent\Model;

use App\Models\Tasks\DailyTask;

class UserDailyTasks extends Model
{
    protected $guarded = [];
    protected $table = "telegram_user_daily_tasks";

    public static function dailyTasksForUser($userId)
    {
        return self::where(['telegram_user_id' => $userId, 'completed' => false])->orderBy('created_at', 'asc')->get();

        // foreach ($dailyTasks as $task)
        // {
        //     return yield [DailyTask::where(['task_id' => $task['task_id']])->first(), $task['created_at']];
        // }
    }

    public static function lastClaimedDailyTaskForUser($userId)
    {
        $completedDailyTasks = self::where(['telegram_user_id' => $userId, 'completed' => true])->get();

        if (count($completedDailyTasks)) {
            return $completedDailyTasks->orderBy('updated_at', 'desc')->first();
        }
    }
}
