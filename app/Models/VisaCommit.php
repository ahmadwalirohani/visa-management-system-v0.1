<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VisaCommit extends Model
{
    use HasFactory;

    public function setData(object | array $payload): self
    {

        $this->customer_id = $payload->customer;
        $this->name = $payload->name;
        $this->remarks = $payload->remarks;
        $this->image = $payload->image;
        $this->created_user_id = auth()->user()->id;

        return $this;
    }

    public function commited_visas(): HasMany
    {
        return $this->hasMany(CommittedVisas::class, 'visa_commit_id')->withVisa();
    }

    public function scopeWithCommitedVisas($query): void
    {
        $query->with('commited_visas');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class)->select(['id', 'name', 'code']);
    }

    public function scopeWithCustomer($query): void
    {
        $query->with('customer');
    }
}
