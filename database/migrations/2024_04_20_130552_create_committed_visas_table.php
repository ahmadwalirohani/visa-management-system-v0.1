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
        Schema::create('committed_visas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visa_commit_id')->constrained('visa_commits')->cascadeOnDelete();
            $table->foreignId('visa_id')->constrained('visas')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committed_visas');
    }
};
