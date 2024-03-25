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
        Schema::create('exchange_rates', function (Blueprint $table) {
            $table->id();
            $table->double('amount')->default(1);
            $table->double('rate')->default(1);
            $table->foreignId('currency_id');
            $table->foreignId("default_currency_id");
            $table->foreign('currency_id')->on('currencies')->references('id');
            $table->foreign('default_currency_id')->on('currencies')->references('id');
            $table->foreignId('created_user_id');
            $table->foreign('created_user_id')->on('users')->references('id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exchange_rates');
    }
};
