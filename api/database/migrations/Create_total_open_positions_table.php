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
        Schema::create('total_open_positions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('pair_id')->references('id')->on('pairs')->unique();
            $table->integer('total_long_value')->default(0);
            $table->integer('total_short_value')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('total_open_positions');
    }
};
