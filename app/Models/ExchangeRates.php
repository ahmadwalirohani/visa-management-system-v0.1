<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExchangeRates extends Model
{
    use HasFactory;

    public function addCurrencyRate(object | array $currencyRate): self
    {
        $this->amount = $currencyRate->amount;
        $this->rate = $currencyRate->rate;
        $this->currency_id = $currencyRate->currency_id;
        $this->default_currency_id = $currencyRate->default_currency_id;
        $this->created_user_id = auth()->user()->id;

        return $this;
    }

    public function scopeGetLatest($query): void
    {
        $query->lastest("id")->groupBy('currency_id');
    }
}
