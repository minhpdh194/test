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
        Schema::table('daily_tasks', function (Blueprint $table) {
            $table->string('name_es')->nullable();
            $table->string('name_fr')->nullable();
            $table->string('description_es')->nullable();
            $table->string('description_fr')->nullable();
        });

        Schema::table('daily_tasks_questions', function (Blueprint $table) {
            $table->string('description_fr')->nullable();
            $table->string('description_es')->nullable();
        });

        Schema::table('daily_tasks_answers', function (Blueprint $table) {
            $table->string('description_fr')->nullable();
            $table->string('description_es')->nullable();
        });

        Schema::table('user_profile', function (Blueprint $table) {
            $table->string('selected_language')->default('en');
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
