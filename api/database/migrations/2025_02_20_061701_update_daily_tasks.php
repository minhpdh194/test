<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('daily_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->decimal('reward_coins')->default(0);
            $table->string('link')->nullable();
            $table->string('type')->default('daily');
            $table->string('action_name')->nullable();
            $table->string('complete_requirement')->nullable();
            $table->timestamps();
        });

        Schema::create('daily_tasks_answers', function (Blueprint $table) {
            $table->id();
            $table->string('description')->nullable();
            $table->boolean('is_correct')->default(false);
            $table->string('question_id')->nullable();
            $table->timestamps();
        });

        Schema::create('daily_tasks_questions', function (Blueprint $table) {
            $table->id();
            $table->string('description')->nullable();
            $table->string('type');
            $table->string('video_id');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
