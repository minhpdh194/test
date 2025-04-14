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
        Schema::create('daily_pnl', function (Blueprint $table) {
            $table->id();
            $table->string('telegram_user_id')->default("");
            $table->double("pnl")->default(0);
        });

        Schema::create('weekly_pnl', function (Blueprint $table) {
            $table->id();
            $table->string('telegram_user_id')->default("");
            $table->integer("year")->default(0);
            $table->tinyInteger("week")->default(0);
            $table->double("pnl")->default(0);
        });

        Schema::create('monthly_pnl', function (Blueprint $table) {
            $table->id();
            $table->string('telegram_user_id')->default("");
            $table->integer("year")->default(0);
            $table->tinyInteger("month")->default(0);
            $table->double("pnl")->default(0);
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
