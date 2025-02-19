<?php

namespace App\Http\Controllers;

use App\Models\Tasks\DailyTasks;
use App\Models\TelegramUser;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $userCount = TelegramUser::count();
        $dailyTaskCount = DailyTasks::count();
        return view('dashboard', compact('userCount', 'dailyTaskCount'));
    }

    public function users()
    {
        $users = TelegramUser::all();
        return view('users', compact('users'));
    }

    public function createTask()
    {
        return view('create_task');
    }

    public function dailyTasks()
    {
        $dailyTasks = DailyTasks::all();
        return view('daily_tasks', compact('dailyTasks'));
    }

    public function createDailyTask()
    {
        return view('create_daily_task');
    }

    public function storeDailyTask(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'required_login_streak' => 'required|integer|min:1|max:10',
            'reward_coins' => 'required|integer|min:1',
        ]);

        DailyTasks::create($validated);

        return redirect()->route('daily_tasks')->with('success', 'Daily task created successfully');
    }

    public function editTask(DailyTasks $task)
    {
        return view('tasks.edit', compact('task'));
    }

    public function updateTask(Request $request, DailyTasks $task)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'required_taps' => 'required|integer|min:0',
            'reward_coins' => 'required|integer|min:1',
        ]);

        $task->update($validated);

        return redirect()->route('tasks')->with('success', 'Task updated successfully');
    }

    public function deleteTask(DailyTasks $task)
    {
        $task->delete();
        return redirect()->route('tasks')->with('success', 'Task deleted successfully');
    }

    public function editDailyTask(DailyTasks $dailyTask)
    {
        return view('daily_tasks.edit', compact('dailyTask'));
    }

    public function updateDailyTask(Request $request, DailyTasks $dailyTask)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'required_login_streak' => 'required|integer|min:1|max:10',
            'reward_coins' => 'required|integer|min:1',
        ]);

        $dailyTask->update($validated);

        return redirect()->route('daily_tasks')->with('success', 'Daily task updated successfully');
    }

    public function deleteDailyTask(DailyTasks $dailyTask)
    {
        $dailyTask->delete();
        return redirect()->route('daily_tasks')->with('success', 'Daily task deleted successfully');
    }
}
