<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bank extends Model
{
    use HasFactory;


    public function setData(object | array $data): self
    {

        $this->name = $data->name;
        $this->code = $data->code;
        $this->email = $data->email;
        $this->address = $data->address;
        $this->phone = $data->phone;
        $this->branch_id = $data->branch;
        $this->created_user_id = auth()->user()->id;

        return $this;
    }

    public function balancies(): HasMany
    {
        return $this->hasMany(BankAccount::class)->with('currency');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function scopeWithBranch($query): void
    {
        $query->with('branch');
    }

    public function scopeWithBalancies($query): void
    {
        $query->with('balancies');
    }
}
