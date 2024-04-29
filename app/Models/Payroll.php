<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payroll extends Model
{
    use HasFactory;

    public function setData(object | array $payload): self
    {
        $this->start_date = $payload->start_date;
        $this->end_date = $payload->end_date;
        $this->working_days = $payload->working_days;
        $this->remarks = $payload->remarks;
        $this->currency_id = $payload->currency;
        $this->created_user_id = auth()->user()->id;

        return $this;
    }

    public function details(): HasMany
    {
        return $this->hasMany(PayrollDetails::class)->with('employee');
    }

    public function scopeWithDetails($query): void
    {
        $query->with('details');
    }
}
