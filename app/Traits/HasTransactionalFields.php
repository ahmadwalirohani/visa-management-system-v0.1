<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;

trait HasTransactionalFields
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

    public int | null $customer_id = null;

    public int | null $visa_id = null;


    public function createAccount(Model $account): self
    {
        $this->model = $account;

        ($account)->create([
            "currency_id" => $this->currency_id,
            $this->fieldName => $this->id,
            "balance" => $this->credit_amount,
        ]);

        return $this;
    }

    public function checkAccountAvailabilty(Model $account, string $fieldName): bool | object
    {
        $findAccount = $account::where($fieldName, $this->id)->whereCurrencyId($this->currency_id)->first();
        if ($findAccount !== null) {
            return $findAccount;
        }

        return false;
    }



    public function setId(int $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function setCustomerId(int $id): self
    {
        $this->customer_id = $id;

        return $this;
    }

    public function setVisaId(int | null $visaId): self
    {
        $this->visa_id = $visaId;

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
}
