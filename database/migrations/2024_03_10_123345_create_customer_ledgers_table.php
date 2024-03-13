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
        Schema::create('customer_ledgers', function (Blueprint $table) {
            $table->id();
            $table->string("transactionType");
            $table->decimal("credit_amount", 18, 2)->default(0);
            $table->decimal("debit_amount", 18, 2)->default(0);
            $table->decimal("balance", 20, 2)->default(0);
            $table->decimal("exchange_rate", 20, 2)->default(0);
            $table->decimal("exchange_amount", 20, 2)->default(0);
            $table->foreignId('customer_id')->constrained("customers")->cascadeOnDelete();
            $table->foreignId("currency_id")->constrained("currencies")->cascadeOnDelete();
            $table->foreignId("ex_currency_id")->constrained("currencies")->cascadeOnDelete();
            $table->foreignId("created_user_id")->constrained("users")->cascadeOnDelete();
            $table->foreignId("bank_id")->nullable()->constrained("banks")->cascadeOnDelete();
            $table->foreignId("till_id")->nullable()->constrained("tills")->cascadeOnDelete();
            $table->text("remarks")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_ledgers');
    }
};
