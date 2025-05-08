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
        Schema::create('total_pnl', function (Blueprint $table) {
            $table->id();
            $table->string('telegram_user_id', 50)->references('telegram_user_id')->on('user_profile')->onDelete('cascade')->index();
            $table->double("pnl")->default(0);
            $table->timestamps();
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
