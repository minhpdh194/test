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
            $table->integer('pair_id')->default(0)->change();
            $table->decimal('prev_value', 15, 8)->default(0)->change();
            $table->decimal('current_value', 15, 8)->default(0)->change();
            $table->decimal('daily_return', 15, 8)->default(0)->change();
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
