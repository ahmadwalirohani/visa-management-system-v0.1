<?php

namespace App\Services;

use App\Contracts\ICustomerService;
use Illuminate\Database\Eloquent\Model;

class HRAccountingService //  implements ICustomerService
{

    public int $id;
    public int $currency_id;
    public int $ex_currency_id;
    public string $transactionType;
    public string | null $remarks = null;

    public float $credit_amount = 0;
    public float $debit_amount = 0;
    public float $balance;
    public float $exchange_rate = 0;
    public float $exchange_amount = 0;

    public function __construct(
        public Model $model,
        public string $fieldName = 'customer_id'
    ) {
    }

    public function createAccount(Model $account): self
    {
        $this->model = $account;

        ($account)->create([
            "currency_id" => $this->currency_id,
            $this->fieldName => $this->id,
            "balance" => $this->balance,
        ]);

        return $this;
    }

    public function createStatement(Model $creditLegder): self
    {
        ($creditLegder)->setData((object)[
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

    public function setId(int $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function setCurrencyId(int $currency_id): self
    {
        $this->currency_id = $currency_id;

        return $this;
    }

    public function setExCurrencyId(int $ex_currency_id): self
    {
        $this->ex_currency_id = $ex_currency_id;

        return $this;
    }

    public function setTransactionType(string $transactionType): self
    {
        $this->transactionType = $transactionType;

        return $this;
    }

    public function setRemarks(string | null $remarks): self
    {
        $this->remarks = $remarks;

        return $this;
    }

    public function setCreditAmount(int $credit_amount): self
    {
        $this->credit_amount = $credit_amount;

        return $this;
    }

    public function setExchangeAmount(int $exchange_amount): self
    {
        $this->exchange_amount = $exchange_amount;

        return $this;
    }

    public function setExchangeRate(float $exchange_rate): self
    {
        $this->exchange_rate = $exchange_rate;

        return $this;
    }

    public function setDebitAmount(float $debit_amount): self
    {
        $this->debit_amount = $debit_amount;

        return $this;
    }

    public function setBalance(float $balance): self
    {
        $this->balance = $balance;

        return $this;
    }


    public static function checkAccount(): bool
    {
        return true;
    }
}
