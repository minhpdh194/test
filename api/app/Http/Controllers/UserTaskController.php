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

    public function receiveTask(Request $request)
    {
        return $this->taskService->receiveTask($request->user(), $request->task);
    }

    public function getUserTask(Request $request)
    {
        $receivedTasks = UserTasks::where('telegram_user_id', $request->user()->telegram_user_id)->get();
        return response()->json($receivedTasks);
    }
}
