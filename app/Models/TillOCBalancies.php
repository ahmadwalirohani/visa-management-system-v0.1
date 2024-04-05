<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TillOCBalancies extends Model
{
    use HasFactory;

    public function setData(object | array $payload): self
    {
        if (!$payload->is_open == 1) {
            $this->currency_id = $payload->currency_id;
            $this->till_opening_closing_id = $payload->id;
            $this->opened_balance = $payload->old_balance;
        } else {
            $this->closed_balance = $payload->current_balance;
            $this->credit_amount = $payload->credit_amount;
            $this->debit_amount = $payload->debit_amount;
        }

        return $this;
    }
}
