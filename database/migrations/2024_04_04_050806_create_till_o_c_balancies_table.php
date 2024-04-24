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
        Schema::create('till_o_c_balancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('till_opening_closing_id')->constrained('till_opening_closings')->cascadeOnDelete();
            $table->foreignId('currency_id')->constrained('currencies')->cascadeOnDelete();
            $table->decimal('opened_balance', 20, 2)->default(0);
            $table->decimal('closed_balance', 20, 2)->default(0);
            $table->decimal('credit_amount', 20, 2)->default(0);
            $table->decimal('debit_amount', 20, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('till_o_c_balancies');
    }
};
