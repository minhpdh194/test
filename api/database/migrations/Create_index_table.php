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
        Schema::create('indices', function (Blueprint $table) {
            $table->integer('pair_id')->references('id')->on('pairs');
            $table->enum('long_short', ['long', 'short']);
            $table->double('value')->default(0);
            $table->timestamps();

            $table->unique(['pair_id', 'long_short', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indices');
    }
};
