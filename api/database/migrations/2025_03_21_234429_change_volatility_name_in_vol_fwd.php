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
        Schema::table('vol_fwd', function (Blueprint $table) {
            $table->renameColumn('volatility', 'current_volatility');
            $table->double('prev_volatility')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vol_fwd', function (Blueprint $table) {
            //
        });
    }
};
