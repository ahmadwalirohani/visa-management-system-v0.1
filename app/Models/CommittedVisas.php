<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommittedVisas extends Model
{
    use HasFactory;

    public function setData(object | array $payload): self
    {

        $this->visa_commit_id = $payload->id;
        $this->visa_id = $payload->visa_id;

        return $this;
    }

    public function visa(): BelongsTo
    {
        return $this->belongsTo(Visa::class)->select(['id', 'visa_no', 'passport_no', 'name']);
    }

    public function scopeWithVisa($query): void
    {
        $query->with('visa');
    }
}
