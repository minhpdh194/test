<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Tasks\UserTasks;
use App\Services\TaskService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserTaskController extends Controller
{
    private $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function claimTask(Request $request)
    {
        return $this->taskService->claimTask($request->user(), $request->task);
    }

    public function taskInProgress(Request $request)
    {
        return $this->taskService->taskInProgress($request->user(), $request->task);
    }

    public function getUserInProgressTasks(Request $request)
    {
        $userTasks = UserTasks::where('telegram_user_id', $request->user()->telegram_user_id)
            ->where('completed', false)->pluck('task_id');
        return response()->json($userTasks);
    }

    public function getUserCompletedTasks(Request $request)
    {
        $userTasks = UserTasks::where('telegram_user_id', $request->user()->telegram_user_id)
            ->where('completed', true)->get();
        return response()->json($userTasks);
    }
}
