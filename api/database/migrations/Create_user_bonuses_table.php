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
        Schema::create('user_bonuses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('bonus_id')->nullable(false);
            $table->integer('telegram_user_id')->references('telegram_user_id')->on('user_profile')->onDelete('cascade');
            $table->integer('position_id')->references('id')->on('positions')->onDelete('cascade');
            $table->timestamp('purchase_time');
            $table->timestamp('end_date')->nullable();
            $table->boolean('is_expired')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_bonuses');
    }
};
