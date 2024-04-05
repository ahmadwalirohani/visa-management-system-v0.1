<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TillOpeningClosing extends Model
{
    use HasFactory;

    public function setData(object | array $payload): self
    {

        if (!$payload->is_open == 1) {
            $this->till_id = $payload->id;
            $this->created_user_id   = auth()->user()->id;
            $this->remarks = $payload->remarks ?? '';
            $this->opened_date = now();
        } else $this->closed_date = now();

        return $this;
    }

    public function balancies(): HasMany
    {
        return $this->hasMany(TillOCBalancies::class, 'till_opening_closing_id');
    }

    public function scopeWithBalancies($query): void
    {
        $query->with('balancies');
    }
}
