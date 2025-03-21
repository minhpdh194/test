<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_tasks', function (Blueprint $table) {
            $table->increments('id');
            $table->string('telegram_user_id')->references('telegram_user_id')->on('user_profile')->index()->onDelete('cascade');
            $table->integer('task_id')->references('id')->on('tasks');
            $table->boolean('completed')->default(false);
            $table->string('task_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_tasks');
    }
};
