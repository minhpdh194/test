<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Create Daily Task') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 bg-white border-b border-gray-200">
                    <h1 class="text-2xl font-bold mb-4">Create New Daily Task</h1>
                    <form action="{{ route('store_daily_task') }}" method="POST">
                        @csrf
                        <div class="mb-4">
                            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                            <input type="text" name="name" id="name"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required>
                        </div>
                        <div class="mb-4">
                            <label for="description"
                                class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                            <textarea name="description" id="description"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required></textarea>
                        </div>
                        <div class="mb-4">
                            <label for="type" class="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                            <select name="type" id="type"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="0" selected>Click to get free token</option>
                                <option value="1">Answer a question</option>
                                <option value="2">Read a X post</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label for="link" class="block text-gray-700 text-sm font-bold mb-2">Link: </label>
                            <input type="text" name="link" id="link"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="mb-4">
                            <label for="reward_coins" class="block text-gray-700 text-sm font-bold mb-2">Reward Coins:
                            </label>
                            <input type="number" name="reward_coins" id="reward_coins"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required>
                        </div>
                        <div class="mb-4">
                            <label for="question_type" class="block text-gray-700 text-sm font-bold mb-2">Question
                                Type:</label>
                            <select name="question_type" id="question_type"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="0" selected>None</option>
                                <option value="1">Single Choice</option>
                                <option value="2">Multiple Choice</option>
                            </select>
                        </div>

                        <div id="answers_section" class="mb-4 hidden">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Answers:</label>
                            <div id="answers_container">
                                
                            </div>
                            <button type="button" id="add_answer"
                                class="mt-2 bg-green-500 hover:bg-green-700 text-black font-bold py-1 px-4 rounded">
                                + Add Answer
                            </button>
                        </div>

                        <button type="submit"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Create
                            Daily Task</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const questionType = document.getElementById("question_type");
        const answersSection = document.getElementById("answers_section");
        const addAnswerBtn = document.getElementById("add_answer");
        const answersContainer = document.getElementById("answers_container");

        // Function to show/hide the answer section
        questionType.addEventListener("change", function () {
            if (this.value == "1" || this.value == "2") {
                answersSection.classList.remove("hidden");
            } else {
                answersSection.classList.add("hidden");
                answersContainer.innerHTML = ""; // Clear answers if hidden
            }
        });

        // Function to add an answer input field
        addAnswerBtn.addEventListener("click", function () {
            const answerIndex = document.querySelectorAll(".answer-group").length;

            const answerDiv = document.createElement("div");
            answerDiv.classList.add("answer-group", "flex", "items-center", "mb-2");
            answerDiv.innerHTML = `
                <input type="text" name="answers[${answerIndex}][text]" placeholder="Enter answer"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                <label class="ml-2 flex items-center">
                    <input type="checkbox" name="answers[${answerIndex}][is_correct]" class="ml-2">
                    <span class="ml-1 text-sm">Correct</span>
                </label>
                <button type="button" class="ml-2 text-red-500 remove-answer">X</button>
            `;

            answersContainer.appendChild(answerDiv);

            // Add event listener to remove button
            answerDiv.querySelector(".remove-answer").addEventListener("click", function () {
                answerDiv.remove();
            });
        });
    });
</script>
