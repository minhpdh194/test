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
        Schema::table('historical_spots', function (Blueprint $table) {
            $table->decimal('period_return', 15, 8)->default(0);
            $table->integer('fixing_period')->default(0);
            $table->decimal('day_open_value', 15, 8)->default(0);
            $table->decimal('period_open_value', 15, 8)->default(0);
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
