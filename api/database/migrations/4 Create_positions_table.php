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
        Schema::create('positions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('position_id')->nullable(false);
            $table->integer('telegram_user_id')->references('telegram_user_id')->on('user_profile')->onDelete('cascade');
            $table->integer('pair_id')->nullable(false);
            $table->enum('long_short', ['long', 'short']);
            $table->integer('amount')->nullable(false);
            $table->decimal('average_leverage', 8, 6)->nullable(false);
            $table->json('bonuses_id')->nullable();
            $table->timestamp('min_end_date')->nullable(false);
            $table->boolean('alive')->default(true);
            $table->timestamps();

            $table->unique(['position_id', 'telegram_user_id', 'pair_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};
