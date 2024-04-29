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
        Schema::create('visas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->foreignId('type_id')->constrained('visa_types')->cascadeOnDelete();
            $table->foreignId('entrance_type_id')->constrained('visa_sub_types')->cascadeOnDelete();
            $table->foreignId('currency_id')->nullable()->constrained('currencies')->cascadeOnDelete();
            $table->enum('basic_type', ['normal', 'urgent'])->default('normal');
            $table->bigInteger('visa_no')->unique();
            $table->string('name')->nullable();
            $table->decimal('price', 20, 2)->default(0);
            $table->string('province');
            $table->string('passport_no');
            $table->string('job')->nullable();
            $table->string('block_no')->nullable();
            $table->text('remarks')->nullable();
            $table->enum('status', ['registration', 'booked', 'ordered', 'completed'])->default('');
            $table->boolean('is_canceled')->default(false);
            $table->foreignId('created_user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('paid_amount', 18, 2)->default(0);
            $table->decimal('discount_amount', 18, 2)->default(0);
            $table->decimal('expense_amount', 18, 2)->default(0);
            $table->dateTime('booked_date')->nullable();
            $table->dateTime('ordered_date')->nullable();
            $table->dateTime('completed_date')->nullable();
            $table->text('cancel_reason')->nullable();
            $table->boolean('is_commited')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visas');
    }
};
