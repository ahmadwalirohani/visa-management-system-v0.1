<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JournalEntry extends Model
{
    use HasFactory;

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
        if (isset($this->till_id)) $this->till_id = $transaction->till_id;
        if (isset($this->bank_id)) $this->bank_id = $transaction->bank_id;
        $this->visa_id = $transaction->visa_id;
        $this->customer_id = $transaction->customer_id;
        $this->remarks = $transaction->remarks;
        $this->created_user_id = auth()->user()->id;

        return $this;
    }
}
