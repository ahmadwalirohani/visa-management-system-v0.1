<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        "company_ceo",
        "company_name",
        "company_email",
        "company_phone1",
        "company_phone2",
        "company_address",
        "company_logo",
        "voucher_no",
        "visa_no",
        "payment_no",
    ];
}
