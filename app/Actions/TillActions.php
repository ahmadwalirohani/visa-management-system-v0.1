<?php

namespace App\Actions;

use App\Models\Till;
use App\Models\TillAccount;
use App\Services\FinancialService;
use Illuminate\Database\Eloquent\Model;

class TillActions
{
    public FinancialService $financialService;

    public function __construct(protected int $id)
    {
        $this->financialService = new FinancialService(new Till(), 'till_id');
    }

    public function createAccount(TillAccount $account, float $balance, int $currency_id): self
    {
        $this->financialService->setId($this->id)
            ->setBalance($balance)
            ->setCreditAmount($balance)
            ->setCurrencyId($currency_id)
            ->createAccount($account);

        return $this;
    }

    public function createOpeningStatement(string $transactionType, float $credit): self
    {

        $this->financialService->setTransactionType($transactionType)
            ->createStatement();

        return $this;
    }

    public function createCreditStatement(string $transactionType, float $credit_amount, int | null $visa_id = null, string | null $remarks = null): self
    {
        $this->financialService
            ->setTransactionType($transactionType)
            ->setCreditAmount($credit_amount)
            ->setRemarks($remarks)
            ->setVisaId($visa_id)
            ->createStatement();

        return $this;
    }

    public function createDebitStatement(string $transactionType, float $debit_amount): self
    {
        $this->financialService
            ->setTransactionType($transactionType)
            ->setDebitAmount($debit_amount)
            ->createStatement();

        return $this;
    }

    public function creditAccount(int $currency_id, float $amount): self
    {
        $this->financialService
            ->setId($this->id)
            ->setCurrencyId($currency_id)
            ->setCreditAmount($amount)
            ->creditAmountToAccount(new TillAccount());

        return $this;
    }

    public function debitAccount(int $currency_id, float $amount): self
    {
        $this->financialService
            ->setId($this->id)
            ->setCurrencyId($currency_id)
            ->setDebitAmount($amount)
            ->debitAmountFromAccount(new TillAccount());

        return $this;
    }
}
