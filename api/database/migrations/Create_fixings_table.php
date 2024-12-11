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
        Schema::create('fixings', function (Blueprint $table) {
            $table->integer('pair_id')->references('id')->on('pairs')->unique();
            $table->double('prev_spot')->default(0.0);
            $table->double('spot')->default(0.0);
            $table->double('forward')->default(0.0);
            $table->double('option_premium')->default(0.0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fixings');
    }
};
