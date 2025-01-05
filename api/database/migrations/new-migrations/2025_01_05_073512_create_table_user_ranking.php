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
        Schema::create('user_ranking', function (Blueprint $table) {
            $table->id();
            $table->string('telegram_user_id')->default(0);
            $table->string('first_name')->default("");
            $table->string('last_name')->default("");
            $table->string('last_amount_of_tokens')->default("");
            $table->string('current_amount_of_tokens')->default("");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_user_ranking');
    }
};
