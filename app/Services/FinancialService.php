<?php

namespace App\Services;

use App\Models\JournalEntry;
use App\Traits\HasTransactionalFields;
use Illuminate\Database\Eloquent\Model;

class FinancialService
{
    use HasTransactionalFields;

    private int $account_id;

    protected string | null $credit_type = null;
    protected string | null $debit_type = null;

    public function __construct(
        protected Model $model,
        protected string $fieldName = 'till_id'
    ) {
    }

    public function createStatement(?int $bank_id = null, ?int $till_id = null, ?int $customer_id = null, ?int $employee_id = null, ?int $code_id = null): self
    {
        (new JournalEntry())->setData((object)[
            $this->fieldName => $this->id,
            "balance" => $this->balance,
            "credit_amount" => $this->credit_amount,
            "debit_amount" => $this->debit_amount,
            "transactionType" => $this->transactionType,
            "remarks" => $this->remarks,
            "currency_id" => $this->currency_id,
            "ex_currency_id" => $this->ex_currency_id ?? $this->currency_id,
            "exchange_rate" => $this->exchange_rate,
            "exchange_amount" => $this->exchange_amount,
            "credit_type" => $this->credit_type,
            "debit_type" => $this->debit_type,
            'visa_id' => $this->visa_id ?? null,
            'code_id' => $code_id ?? null,
            ($bank_id != null ? 'bank_id' : '') => $bank_id ?? null,
            ($till_id != null ? 'till_id' : '') => $till_id ?? null,
            'employee_id' => $employee_id ?? null,
            'customer_id' => $customer_id ?? null,
        ])
            ->save();

        return $this;
    }

    public function checkAccount(Model $account, callable $callback): self
    {
        $FoundAccount = $this->checkAccountAvailabilty($account, $this->fieldName);
        if (is_object($FoundAccount)) {

            $this->setBalance($FoundAccount->balance);
            $this->account_id = $FoundAccount->id;

            $callback();

            return $this;
        }

        return  $this->createAccount($account);
    }

    public function creditAmountToAccount(Model $account): self
    {

        $this->checkAccount($account, function () use ($account) {
            $_account = $account::find($account->query()->where($this->fieldName, $this->id)->whereCurrencyId($this->currency_id)->first()->id);
            $_account->balance = $_account->balance + $this->credit_amount;
            $_account->save();

            $this->setBalance($_account->balance);
        });
        return $this;
    }

    public function debitAmountFromAccount(Model $account): self
    {

        $this->checkAccount($account, function () use ($account) {
            $_account = $account::find($account->query()->where($this->fieldName, $this->id)->whereCurrencyId($this->currency_id)->first()->id);
            $_account->balance = $_account->balance - $this->debit_amount;
            $_account->save();

            $this->setBalance($_account->balance);
        });
        return $this;
    }

    public function setCreditType(string | null $type): self
    {
        $this->credit_type = $type;

        return $this;
    }

    public function setDebitType(string | null $type): self
    {
        $this->debit_type = $type;

        return $this;
    }
}
