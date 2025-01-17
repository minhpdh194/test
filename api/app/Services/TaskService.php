<?php

namespace App\Services;

use App\Models\Tasks\UserTasks;

class TaskService
{
    public function resetUserDailyTasks()
    {
        $receivedTasks = UserTasks::where('task_type', 'daily')->get();
        foreach ($receivedTasks as $receivedTask) {
            $receivedTask->delete();
        }
    }

    public function claimTask($user, $task)
    {
        $claimedTask = UserTasks::where('telegram_user_id', $user->telegram_user_id)
            ->where('task_id', $task->id)->first();
        if (!$claimedTask) {
            return response()->json(['success' => false, 'message' => 'Task not found.'], 404);
        }

        $claimedTask->completed = 1;
        $claimedTask->save();
        $user->balance += $task->reward_coins;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => "You have successfully claimed $task->reward_coins from $task->name."
        ]);
    }

    public function receiveTask($user, $task)
    {

        if (!$task) {
            return response()->json(['success' => false, 'message' => 'Task not found.']);
        }

        $checkExistReceivedTask = UserTasks::where('telegram_user_id', $user['telegram_user_id'])
            ->where('task_id', $task['id'])->first();

        if ($checkExistReceivedTask) {
            return response()->json(['success' => false, 'message' => 'You have already receive this task.']);
        }

        $result = UserTasks::create([
            'telegram_user_id' => $user['telegram_user_id'],
            'task_id' => $task['id'],
            'task_type' => $task['type'],
        ]);

        if (!$result) {
            return response()->json(['success' => false, 'message' => 'Unable to get task.']);
        } //should never happen

        return response()->json([
            'success' => true,
            'message' => "You have successfully get {$task['name']}."
        ]);
    }
}
