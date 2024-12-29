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
        //Schema::dropIfExists('telegram_user_daily_tasks');
        //Schema::create('telegram_user_daily_tasks', function (Blueprint $table) {
        //    $table->id();
        //    $table->unsignedInteger('user_id'); // Ensure data type matches referenced table
        //    $table->unsignedInteger('task_id'); // Ensure data type matches referenced table
        //    $table->boolean('completed')->default(false); // Fix typo in nullable
        //    $table->timestamps();

            // Add foreign key constraints
        //    $table->foreign('user_id')->references('id')->on('telegram_profile')->onDelete('cascade');
        //    $table->foreign('task_id')->references('id')->on('daily_tasks')->onDelete('cascade');

            // Ensure a user-task pair is unique
        //    $table->unique(['user_id', 'task_id']);
        //});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
