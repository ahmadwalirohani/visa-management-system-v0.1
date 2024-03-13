<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerLedger extends Model
{
    use HasFactory;

    protected $fillable = [
        "transactionType",
        "customer_id",
        "",
    ];

    public function setData(object|array $transaction): self
    {

        $this->transactionType = $transaction->transactionType;
        $this->credit_amount = $transaction->credit_amount;
        $this->debit_amount = $transaction->debit_amount;
        $this->balance = $transaction->balance;
        $this->currency_id = $transaction->currency_id;
        $this->ex_currency_id = $transaction->ex_currency_id;
        $this->exchange_rate = $transaction->exchange_rate;
        $this->exchange_amount = $transaction->exchange_amount;
        $this->customer_id = $transaction->customer_id;
        $this->created_user_id = auth()->user()->id;

        return $this;
    }
}
