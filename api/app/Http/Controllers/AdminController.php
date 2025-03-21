<?php

namespace App\Http\Controllers;

use App\Models\Tasks\DailyTasks;
use App\Models\Tasks\TaskAnswers;
use App\Models\Tasks\TaskQuestions;
use App\Models\TelegramUser;
use App\Services\TranslateService;
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
        \Log::info($request);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'reward_coins' => 'required',
            'action_name' => 'required|string',
        ]);

        $validated['link'] = $request->input('link');
        $validated['action_name'] = $request->input('action_name');
        $validated['complete_requirement'] = 0;
        $validated['name_es'] = TranslateService::translateText($validated['name'], 'espanol');
        $validated['name_fr'] = TranslateService::translateText($validated['name'], 'french');
        $validated['description_es'] = TranslateService::translateText($validated['description'], 'espanol');
        $validated['description_fr'] = TranslateService::translateText($validated['description'], 'french');

        if ($validated['action_name'] == 'answer_question') {
            $questions = $request->input('questions');
            if (count($questions) > 0) {
                $createdTask = DailyTasks::create($validated);
                foreach ($questions as $question) {
                    $answers = $question['answers'];
                    $createdQuestion = null;
                    if (count($answers) > 0) {
                        $createdQuestion = TaskQuestions::create([
                            'description' => $question['text'],
                            'description_es' => TranslateService::translateText($question['text'], "espanol"),
                            'description_fr' => TranslateService::translateText($question['text'], "french"),
                            'type' => $request->input('question_type'),
                            'video_id' => $createdTask->id,
                        ]);
                        foreach ($answers as $answer) {
                            TaskAnswers::create([
                                'question_id' => $createdQuestion->id,
                                'description' => $answer['text'],
                                'description_es' => TranslateService::translateText($answer['text'], "espanol"),
                                'description_fr' => TranslateService::translateText($answer['text'], "french"),
                                'is_correct' => isset($answer['is_correct']) ? true : false,
                            ]);
                        }
                    }
                }
            }
        } else if ($validated['action_name'] != 'none') {
            DailyTasks::create($validated);
        } else {
            return redirect()->route('daily_tasks')->with('success', 'Cannot create new daily task');
        }

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