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
                            <label for="reward_coins" class="block text-gray-700 text-sm font-bold mb-2">Reward Coins:
                            </label>
                            <input type="number" name="reward_coins" id="reward_coins"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required>
                        </div>
                        <div class="mb-4">
                            <label for="link" class="block text-gray-700 text-sm font-bold mb-2">Link: </label>
                            <input type="text" name="link" id="link"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="mb-4">
                            <label for="action_name" class="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                            <select name="action_name" id="action_name"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="free_token" selected>Click to get free token</option>
                                <option value="answer_question">Answer a question</option>
                                <option value="read_x_post">Read a X post</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label for="question_type" class="block text-gray-700 text-sm font-bold mb-2">Question
                                Type:</label>
                            <select name="question_type" id="question_type"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="none" selected>None</option>
                                <option value="single_choice">Single Choice</option>
                                <option value="multiple_choice">Multiple Choice</option>
                            </select>
                        </div>

                        <!-- Question Section -->
                        <div id="questions_section" class="mb-4 hidden">
                            <label class="block text-gray-700 text-sm font-bold mb-2">Questions:</label>
                            <div id="questions_container"></div>
                            <button type="button" id="add_question"
                                class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                                + Add Question
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
    document.addEventListener("DOMContentLoaded", function() {
        const questionType = document.getElementById("question_type");
        const questionsSection = document.getElementById("questions_section");
        const addQuestionBtn = document.getElementById("add_question");
        const questionsContainer = document.getElementById("questions_container");

        // Show/Hide Questions Section
        questionType.addEventListener("change", function() {
            if (this.value === "single_choice" || this.value === "multiple_choice") {
                questionsSection.classList.remove("hidden");
            } else {
                questionsSection.classList.add("hidden");
                questionsContainer.innerHTML = ""; // Clear questions if hidden
            }
        });

        // Add a Question
        addQuestionBtn.addEventListener("click", function() {
            const questionIndex = document.querySelectorAll(".question-group").length;

            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question-group", "border", "p-3", "rounded", "mb-3",
                "bg-gray-100");
            questionDiv.innerHTML = `
                <label class="block text-gray-700 text-sm font-bold mb-2">Question:</label>
                <input type="text" name="questions[${questionIndex}][text]" placeholder="Enter question"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                <button type="button" class="mt-2 bg-red-500 hover:bg-red-700 text-black font-bold py-1 px-4 rounded remove-question">
                    Remove Question
                </button>

                <!-- Answers Section for Each Question -->
                <div class="mt-3">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Answers:</label>
                    <div class="answers-container"></div>
                    <button type="button" class="mt-2 bg-green-500 hover:bg-green-700 text-black font-bold py-1 px-4 rounded add-answer">
                        + Add Answer
                    </button>
                </div>
            `;

            questionsContainer.appendChild(questionDiv);

            // Remove Question Button
            questionDiv.querySelector(".remove-question").addEventListener("click", function() {
                questionDiv.remove();
            });

            // Add Answer to the Question
            questionDiv.querySelector(".add-answer").addEventListener("click", function() {
                const answersContainer = questionDiv.querySelector(".answers-container");
                const answerIndex = answersContainer.querySelectorAll(".answer-group").length;

                const answerDiv = document.createElement("div");
                answerDiv.classList.add("answer-group", "flex", "items-center", "mb-2");
                answerDiv.innerHTML = `
                    <input type="text" name="questions[${questionIndex}][answers][${answerIndex}][text]" placeholder="Enter answer"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <label class="ml-2 flex items-center">
                        <input type="checkbox" name="questions[${questionIndex}][answers][${answerIndex}][is_correct]" class="ml-2">
                        <span class="ml-1 text-sm">Correct</span>
                    </label>
                    <button type="button" class="ml-2 text-red-500 remove-answer">X</button>
                `;

                answersContainer.appendChild(answerDiv);

                // Remove Answer Button
                answerDiv.querySelector(".remove-answer").addEventListener("click", function() {
                    answerDiv.remove();
                });
            });
        });
    });
</script>
n
