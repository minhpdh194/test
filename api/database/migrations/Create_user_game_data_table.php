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
        Schema::create('user_game_data', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->references('id')->on('user_profile')->unique();
            $table->string('telegram_user_id', 50)->references('telegram_user_id')->on('user_profile')->unique();
            $table->tinyInteger('level')->default(1)->unsigned();
            $table->tinyInteger('avatar_id')->default(0)->unsigned(); // This is the avatar_id of avatar picture
            $table->decimal('amount_of_tokens', 20, 6)->default(0);
            $table->decimal('balance', 18, 6)->default(0);
            $table->decimal('total_pnl', 18, 6)->default(0);
            $table->integer('available_energy')->default(500);
            $table->json('bonuses')->nullable();
            $table->double('perf_from_start_date')->default(0);
            $table->double('perf_since_last_fixing')->default(0);
            $table->integer('number_of_stars')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_game_data');
    }
};