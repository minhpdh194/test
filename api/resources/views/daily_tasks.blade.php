<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Daily Tasks') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <h1 class="text-2xl font-bold mb-4">Daily Task List</h1>
                    <a href="{{ route('create_daily_task') }}"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">Create
                        New Daily Task</a>
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th class="text-left py-2">ID</th>
                                <th class="text-left py-2">Name</th>
                                <th class="text-left py-2">Description</th>
                                <th class="text-left py-2">Link</th>
                                <th class="text-left py-2">Reward Coins</th>
                                <th class="text-left py-2">Action Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($dailyTasks as $task)
                                <tr>
                                    <td>{{ $task->id }}</td>
                                    <td>{{ $task->name }}</td>
                                    <td>{{ $task->description }}</td>
                                    <td>{{ $task->link }}</td>
                                    <td>{{ $task->reward_coins }}</td>
                                    <td>
                                        @if ($task->action_name == 'free_token')
                                            Receive Free Token
                                        @elseif ($task->action_name == 'answer_question')
                                            Answer Question
                                        @elseif ($task->action_name == 'read_x_post')
                                            Read X Post
                                        @else
                                            Unknown
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
