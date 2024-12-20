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
        Schema::create('vol_fwd', function (Blueprint $table) {
            $table->id();
            $table->integer('pair_id')->references('id')->on('pairs')->unique();
            $table->double('yield')->default(0);
            $table->double('forward')->default(0);
            $table->double('volatility')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vol_fwd');
    }
};
