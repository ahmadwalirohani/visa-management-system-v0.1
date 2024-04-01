<?php

namespace App\Actions;

use App\Models\Employee;
use App\Models\EmployeeAccount;
use App\Models\EmployeeLedger;
use App\Services\HRAccountingService;

class EmployeeAccountingActions
{
    protected HRAccountingService $hrAccountingService;

    public function __construct(protected int $id)
    {
        $this->hrAccountingService = new HRAccountingService(new Employee(), 'employee_id');
    }

    public function createAccount(EmployeeAccount $account, float $balance, int $currency_id): self
    {
        $this->hrAccountingService->setId($this->id)
            ->setBalance($balance)
            ->setCurrencyId($currency_id)
            ->createAccount($account);

        return $this;
    }

    public function createDebitStatement(
        string $transactionType,
        float $debit,
        ?int $visa_id = null,
        ?string $remarks = '',
        ?int $ex_currency_id = null,
        ?float $exchange_rate = 0,
        ?float $exchanged_amount = 0,
        ?int $till_id = null,
        ?int $bank_id = null,
    ): self {

        $this->hrAccountingService->setTransactionType($transactionType)
            ->setDebitAmount($debit)
            ->setVisaId($visa_id)
            ->setRemarks($remarks)
            ->setExchangeAmount($exchanged_amount)
            ->setExCurrencyId($ex_currency_id)
            ->setExchangeRate($exchange_rate)

            ->createStatement(new EmployeeLedger(), $bank_id, $till_id);

        return $this;
    }

    public function createCreditStatement(
        string $transactionType,
        float $credit,
        ?int $visa_id = null,
        ?string $remarks = '',
        ?int $ex_currency_id = null,
        ?float $exchange_rate = 0,
        ?float $exchanged_amount = 0,
        ?int $till_id = null,
        ?int $bank_id = null,
    ): self {

        $this->hrAccountingService->setTransactionType($transactionType)
            ->setCreditAmount($credit)
            ->setVisaId($visa_id)
            ->setRemarks($remarks)
            ->setExchangeAmount($exchanged_amount)
            ->setExCurrencyId($ex_currency_id)
            ->setExchangeRate($exchange_rate)

            ->createStatement(new EmployeeLedger(), $bank_id, $till_id);

        return $this;
    }

    public function debitAccount(int $currency_id, float $amount): self
    {
        $this->hrAccountingService
            ->setId($this->id)
            ->setCurrencyId($currency_id)
            ->setDebitAmount($amount)
            ->debitAmountFromAccount(new EmployeeAccount());

        return $this;
    }

    public function creditAccount(int $currency_id, float $amount): self
    {
        $this->hrAccountingService
            ->setId($this->id)
            ->setCurrencyId($currency_id)
            ->setCreditAmount($amount)
            ->creditAmountToAccount(new EmployeeAccount());

        return $this;
    }
}
