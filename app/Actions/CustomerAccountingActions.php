<?php

namespace App\Actions;

use App\Models\Customer;
use App\Models\CustomerAccount;
use App\Models\CustomerLedger;
use App\Services\HRAccountingService;

class CustomerAccountingActions
{
    protected HRAccountingService $hrAccountingService;

    public function __construct(protected int $id)
    {
        $this->hrAccountingService = new HRAccountingService(new Customer(), 'customer_id');
    }

    public function createAccount(CustomerAccount $account, float $balance, int $currency_id): self
    {
        $this->hrAccountingService->setId($this->id)
            ->setBalance($balance)
            ->setCurrencyId($currency_id)
            ->createAccount($account);

        return $this;
    }

    public function createDebitStatement(CustomerLedger $ledger, string $transactionType, float $debit): self
    {

        $this->hrAccountingService->setTransactionType($transactionType)
            ->setDebitAmount($debit)
            ->createStatement($ledger);

        return $this;
    }
}
