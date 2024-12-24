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
        Schema::table('user_bonuses', function (Blueprint $table) {
            $table->renameColumn('user_id','telegram_user_id');
        });

        Schema::table('positions', function (Blueprint $table) {
            $table->renameColumn('user_id','telegram_user_id');
        });

        Schema::table('user_tasks', function (Blueprint $table) {
            $table->renameColumn('user_id','telegram_user_id');
        });

        Schema::table('user_referral_tasks', function (Blueprint $table) {
            $table->renameColumn('user_id','telegram_user_id');
        });

        Schema::table('active_sessions', function (Blueprint $table) {
            $table->renameColumn('user_id','telegram_user_id');
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
