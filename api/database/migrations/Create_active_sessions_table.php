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
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->nullable(false)->unique();
            $table->integer('user_id')->nullable(false)->index();
            $table->string('telegram_id')->references('telegram_user_id')->on('user_profile')->unique()->index();
            $table->string('chat_id', 100)->nullable();
            $table->timestamp('last_activity')->default(now());
            $table->string('ip_address', 40)->nullable(false)->unique();
            $table->string('user_agent')->nullable();
            $table->string('payload');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
