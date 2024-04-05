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
        Schema::create('till_opening_closings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('till_id')->constrained('tills')->cascadeOnDelete();
            $table->foreignId('created_user_id')->constrained('users')->cascadeOnDelete();
            $table->date('opened_date');
            $table->date('closed_date')->nullable();
            $table->text('remarks');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('till_opening_closings');
    }
};
