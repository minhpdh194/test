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
        Schema::create('pending_invoices', function (Blueprint $table) {
            $table->increments('id');
            $table->string('telegram_user_id')->references('telegram_user_id')->on('user_profile')->onDelete('cascade');
            $table->integer('bonus_id')->nullable(false);
            $table->integer('number_of_stars')->nullable(false)->default(0);
            $table->boolean('paid')->default(false);
            $table->timestamps();

            $table->unique(['telegram_user_id', 'bonus_id', 'paid']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pending_invoices');
    }
};