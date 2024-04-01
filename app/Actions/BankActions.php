<?php

namespace App\Actions;

use App\Models\Bank;
use App\Models\BankAccount;
use App\Services\FinancialService;
use Illuminate\Database\Eloquent\Model;

class BankActions
{
    public FinancialService $financialService;

    public function __construct(protected int $id)
    {
        $this->financialService = new FinancialService(new Bank(), 'bank_id');
    }

    public function createAccount(BankAccount $account, float $balance, int $currency_id): self
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

        $this->financialService
            ->setCreditType('bank')
            ->setTransactionType($transactionType)
            ->createStatement();

        return $this;
    }

    public function createCreditStatement(
        string $transactionType,
        float $credit_amount,
        int | null $visa_id = null,
        string | null $remarks = null,
        ?int $ex_currency_id = null,
        ?float $exchange_rate = 0,
        ?float $exchanged_amount = 0,
        ?int $customer_id = null,
        ?int $till_id = null,
        ?int $employee_id = null,
        ?int $eicode_id = null,
        ?string $debitType = null,
    ): self {
        $this->financialService
            ->setTransactionType($transactionType)
            ->setCreditAmount($credit_amount)
            ->setRemarks($remarks)
            ->setVisaId($visa_id)
            ->setExchangeAmount($exchanged_amount)
            ->setExCurrencyId($ex_currency_id)
            ->setExchangeRate($exchange_rate)
            ->setDebitType($debitType)
            ->setCreditType('bank')
            ->createStatement(null, $till_id, $customer_id, $employee_id, $eicode_id);

        return $this;
    }

    public function createDebitStatement(
        string $transactionType,
        float $debit_amount,
        int | null $visa_id = null,
        string | null $remarks = null,
        ?int $ex_currency_id = null,
        ?float $exchange_rate = 0,
        ?float $exchanged_amount = 0,
        ?int $customer_id = null,
        ?int $till_id = null,
        ?int $employee_id = null,
        ?int $eicode_id = null,
        ?string $creditType = null,
    ): self {
        $this->financialService
            ->setTransactionType($transactionType)
            ->setDebitAmount($debit_amount)
            ->setRemarks($remarks)
            ->setVisaId($visa_id)
            ->setExchangeAmount($exchanged_amount)
            ->setExCurrencyId($ex_currency_id)
            ->setExchangeRate($exchange_rate)
            ->setCreditType($creditType)
            ->setDebitType('bank')
            ->createStatement(null, $till_id, $customer_id, $employee_id, $eicode_id);

        return $this;
    }

    public function creditAccount(int $currency_id, float $amount): self
    {
        $this->financialService
            ->setId($this->id)
            ->setCurrencyId($currency_id)
            ->setCreditAmount($amount)
            ->creditAmountToAccount(new BankAccount());

        return $this;
    }

    public function debitAccount(int $currency_id, float $amount): self
    {
        $this->financialService
            ->setId($this->id)
            ->setCurrencyId($currency_id)
            ->setDebitAmount($amount)
            ->debitAmountFromAccount(new BankAccount());

        return $this;
    }
}
