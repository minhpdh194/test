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
        Schema::create('friends_invitations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('inviter_id', 50)->references('telegram_user_id')->on('user_profile')->onDelete('cascade'); 
            $table->string('invitee_id', 50)->references('telegram_user_id')->on('user_profile');
            $table->string('referral_code', 25)->nullable(false);
            $table->boolean('has_connected')->default(false);
            $table->timestamps();

            $table->unique(['inviter_id', 'invitee_id']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('friends_invitations');
    }
};
