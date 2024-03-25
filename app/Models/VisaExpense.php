<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisaExpense extends Model
{
    use HasFactory;

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class)->select(['id', 'name', 'symbol']);
    }
}
