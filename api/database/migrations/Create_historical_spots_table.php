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
        Schema::create('historical_spots', function (Blueprint $table) {
            $table->integer('pair_id')->references('id')->on('pairs');
            $table->decimal('prev_value', 15, 8);
            $table->decimal('current_value', 15, 8); 
            $table->decimal('daily_return', 15, 8);
            $table->timestamps();

            $table->unique(['pair_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historical_spots');
    }
};
