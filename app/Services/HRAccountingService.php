<?php

namespace App\Services;

use App\Contracts\ICustomerService;
use App\Traits\HasTransactionalFields;
use Illuminate\Database\Eloquent\Model;

class HRAccountingService //  implements ICustomerService
{
    use HasTransactionalFields;

    private int $account_id;


    public function __construct(
        public Model $model,
        public string $fieldName = 'customer_id'
    ) {
    }

    public function createStatement(Model $creditLedger, int | null $bank_id = null, int | null $till_id = null): self
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
            "exchange_amount" => $this->exchange_amount,
            'visa_id' => $this->visa_id ?? null,
            'till_id' => $till_id ?? null,
            'bank_id' => $bank_id ?? null,
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
}
