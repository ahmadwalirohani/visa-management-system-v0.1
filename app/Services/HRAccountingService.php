<?php

namespace App\Services;

use App\Contracts\ICustomerService;
use App\Traits\HasTransactionalFields;
use Illuminate\Database\Eloquent\Model;

class HRAccountingService //  implements ICustomerService
{
    use HasTransactionalFields;

    public function __construct(
        public Model $model,
        public string $fieldName = 'customer_id'
    ) {
    }

    public function createStatement(Model $creditLedger): self
    {
        ($creditLedger)->setData((object)[
            $this->fieldName => $this->id,
            "balance" => $this->balance,
            "credit_amount" => $this->credit_amount,
            "debit_amount" => $this->debit_amount,
            "transactionType" => $this->transactionType,
            "remarks" => $this->remarks,
            "currency_id" => $this->currency_id,
            "ex_currency_id" => $this->ex_currency_id ?? $this->currency_id,
            "exchange_rate" => $this->exchange_rate,
            "exchange_amount" => $this->exchange_amount
        ])
            ->save();

        return $this;
    }


    public static function checkAccount(): bool
    {
        return true;
    }
}
