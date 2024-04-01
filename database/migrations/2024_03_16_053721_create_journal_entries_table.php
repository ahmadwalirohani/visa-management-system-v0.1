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
        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->string('transactionType');
            $table->text('remarks')->nullable();
            $table->string('credit_type')->nullable();
            $table->string('debit_type')->nullable();
            $table->double('credit_amount')->default(0);
            $table->double('debit_amount')->default(0);
            $table->double('amount')->default(0);
            $table->double('balance')->default(0);
            $table->foreignId('currency_id')->constrained('currencies')->cascadeOnDelete();
            $table->foreignId('ex_currency_id')->constrained('currencies')->cascadeOnDelete();
            $table->double('exchange_rate')->default(0);
            $table->double('exchange_amount')->default(0);
            $table->foreignId('visa_id')->nullable()->constrained('visas')->cascadeOnDelete();
            $table->foreignId('till_id')->nullable()->constrained('tills')->cascadeOnDelete();
            $table->foreignId('bank_id')->nullable()->constrained('banks')->cascadeOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->cascadeOnDelete();
            $table->foreignId('created_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('code_id')->nullable()->constrained('e_i_codes')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_entries');
    }
};
