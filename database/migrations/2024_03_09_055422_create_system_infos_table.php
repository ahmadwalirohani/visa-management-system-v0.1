<?php

use App\Models\SystemInfo;
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
        Schema::create('system_infos', function (Blueprint $table) {
            $table->id();
            $table->string('company_ceo');
            $table->string('company_name');
            $table->string('company_address');
            $table->string('company_email');
            $table->string('company_phone1')->nullable();
            $table->string('company_phone2')->nullable();
            $table->string('company_logo')->default('http://system.azizivisaservices.com/assets/images/Logo-images/azizi-logo.png');
            $table->bigInteger('visa_no')->default(1);
            $table->bigInteger('voucher_no')->default(1);
            $table->bigInteger('payment_no')->default(1);
            $table->timestamps();
        });

        SystemInfo::create([
            'company_ceo' => 'Mr. CEO',
            'company_name' => 'Example',
            'company_address' => "Example Address",
            "company_email" => "example@gmail.com",
            "company_phone1" => "070000001",
            "company_phone2" => "070000002",
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_infos');
    }
};
