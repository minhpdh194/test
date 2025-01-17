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
        Schema::table('user_tasks', function (Blueprint $table) {
            $table->string('task_type')->nullable()->change();
        });
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('user_referral_tasks');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
