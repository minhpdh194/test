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
        Schema::table('daily_pnl', function (Blueprint $table) {
            $table->timestamps();
        });

        Schema::table('weekly_pnl', function (Blueprint $table) {
            $table->timestamps();
        });

        Schema::table('monthly_pnl', function (Blueprint $table) {
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
