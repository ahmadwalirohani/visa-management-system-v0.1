<?php

namespace App\Actions;

use App\Enums\TransactionTypes;

final class JournalEntryActions
{
    public function __construct(private string $creditType, private string $debitType, private object |array $payload)
    {
    }

    public function serializeTransactions(): void
    {
        $this->resolveCreditTransaction();
        $this->resolveDebitTransaction();
    }

    private function resolveCreditTransaction(): mixed
    {
        return match ($this->creditType) {
            'Customer' => $this->customerCredit(),
            'Employee' => $this->employeeCredit(),
            'Till' => $this->tillCredit(),
            'Bank' => $this->bankCredit(),
            'Extra' => self::class,
            'Expense' => self::class, // $this->expenseCredit(),
        };
    }

    private function resolveDebitTransaction(): mixed
    {
        return match ($this->debitType) {
            'Customer' => $this->customerDebit(),
            'Employee' => $this->employeeDebit(),
            'Till' => $this->tillDebit(),
            'Bank' => $this->bankDebit(),
            'Extra' => self::class,
            'Income' => self::class, // $this->incomeDebit(),
        };
    }
    private function customerCredit(): self
    {

        (new CustomerAccountingActions($this->payload->creditAccount['id']))
            ->creditAccount(
                $this->payload->creditCurrency['id'],
                $this->payload->exchanged_amount,
            )
            ->createCreditStatement(
                'CREDIT-FROM-' . strtoupper($this->payload->debitType),
                $this->payload->exchanged_amount,
                null,
                $this->payload->remarks,
                $this->payload->debitCurrency['id'],
                $this->payload->exchange_rate,
                $this->payload->exchanged_amount,
                ($this->payload->debitType == 'Till' ? $this->payload->debitAccount['id'] : null),
                ($this->payload->debitType == 'Bank' ? $this->payload->debitAccount['id'] : null),
            );

        return $this;
    }

    private function customerDebit(): self
    {
        if (count($this->payload->selectedVisas) == 0) {
            (new CustomerAccountingActions($this->payload->debitAccount['id']))
                ->debitAccount(
                    $this->payload->debitCurrency['id'],
                    $this->payload->amount,
                )
                ->createDebitStatement(
                    'DEBIT-TO-' . strtoupper($this->payload->creditType),
                    $this->payload->amount,
                    null,
                    $this->payload->remarks,
                    $this->payload->creditCurrency['id'],
                    $this->payload->exchange_rate,
                    $this->payload->exchanged_amount,
                    ($this->payload->creditType == 'Till' ? $this->payload->creditAccount['id'] : null),
                    ($this->payload->creditType == 'Bank' ? $this->payload->creditAccount['id'] : null),
                );
        } else {
            foreach ($this->payload->selectedVisas as $visa) {
                (new CustomerAccountingActions($this->payload->debitAccount['id']))
                    ->debitAccount(
                        $this->payload->debitCurrency['id'],
                        $this->payload->amount,
                    )
                    ->createDebitStatement(
                        'DEBIT-TO-' . strtoupper($this->payload->creditType),
                        $this->payload->amount,
                        $visa->id,
                        $this->payload->remarks,
                        $this->payload->creditCurrency['id'],
                        $this->payload->exchange_rate,
                        $this->payload->exchanged_amount,
                        ($this->payload->creditType == 'Till' ? $this->payload->creditAccount['id'] : null),
                        ($this->payload->creditType == 'Bank' ? $this->payload->creditAccount['id'] : null),
                    );
            }
        }
        return $this;
    }

    public function tillCredit(): self
    {
        (new TillActions($this->payload->creditAccount['id']))
            ->creditAccount(
                $this->payload->creditCurrency['id'],
                $this->payload->exchanged_amount,
            )
            ->createCreditStatement(
                'CREDIT-FROM-' . strtoupper($this->payload->debitType),
                $this->payload->exchanged_amount,
                null,
                $this->payload->remarks,
                $this->payload->debitCurrency['id'],
                $this->payload->exchange_rate,
                $this->payload->exchanged_amount,
                ($this->payload->debitType == 'Customer' ? $this->payload->debitAccount['id'] : null),
                ($this->payload->debitType == 'Bank' ? $this->payload->debitAccount['id'] : null),
                ($this->payload->debitType == 'Employee' ? $this->payload->debitAccount['id'] : null),
                ($this->payload->debitType == 'Expense' || $this->payload->debitType == 'Income' ? $this->payload->debitAccount['id'] : null),
                $this->payload->debitType,
            );
        return $this;
    }

    public function tillDebit(): self
    {
        (new TillActions($this->payload->debitAccount['id']))
            ->debitAccount(
                $this->payload->debitCurrency['id'],
                $this->payload->amount,
            )
            ->createDebitStatement(
                'DEBIT-TO-' . strtoupper($this->payload->creditType),
                $this->payload->amount,
                null,
                $this->payload->remarks,
                $this->payload->creditCurrency['id'],
                $this->payload->exchange_rate,
                $this->payload->exchanged_amount,
                ($this->payload->creditType == 'Customer' ? $this->payload->creditAccount['id'] : null),
                ($this->payload->creditType == 'Bank' ? $this->payload->creditAccount['id'] : null),
                ($this->payload->creditType == 'Employee' ? $this->payload->creditAccount['id'] : null),
                ($this->payload->creditType == 'Expense' || $this->payload->creditType == 'Income' ? $this->payload->creditAccount['id'] : null),
                $this->payload->creditType,

            );
        return $this;
    }

    private function employeeCredit(): self
    {

        (new EmployeeAccountingActions($this->payload->creditAccount['id']))
            ->creditAccount(
                $this->payload->creditCurrency['id'],
                $this->payload->exchanged_amount,
            )
            ->createCreditStatement(
                'CREDIT-FROM-' . strtoupper($this->payload->debitType),
                $this->payload->exchanged_amount,
                null,
                $this->payload->remarks,
                $this->payload->debitCurrency['id'],
                $this->payload->exchange_rate,
                $this->payload->exchanged_amount,
                ($this->payload->debitType == 'Till' ? $this->payload->debitAccount['id'] : null),
                ($this->payload->debitType == 'Bank' ? $this->payload->debitAccount['id'] : null),
            );

        return $this;
    }

    private function employeeDebit(): self
    {
        (new EmployeeAccountingActions($this->payload->debitAccount['id']))
            ->debitAccount(
                $this->payload->debitCurrency['id'],
                $this->payload->amount,
            )
            ->createDebitStatement(
                'DEBIT-TO-' . strtoupper($this->payload->creditType),
                $this->payload->amount,
                null,
                $this->payload->remarks,
                $this->payload->creditCurrency['id'],
                $this->payload->exchange_rate,
                $this->payload->exchanged_amount,
                ($this->payload->creditType == 'Till' ? $this->payload->creditAccount['id'] : null),
                ($this->payload->creditType == 'Bank' ? $this->payload->creditAccount['id'] : null),
            );
        return $this;
    }

    public function bankCredit(): self
    {
        (new BankActions($this->payload->creditAccount['id']))
            ->creditAccount(
                $this->payload->creditCurrency['id'],
                $this->payload->exchanged_amount,
            )
            ->createCreditStatement(
                'CREDIT-FROM-' . strtoupper($this->payload->debitType),
                $this->payload->exchanged_amount,
                null,
                $this->payload->remarks,
                $this->payload->debitCurrency['id'],
                $this->payload->exchange_rate,
                $this->payload->exchanged_amount,
                ($this->payload->debitType == 'Customer' ? $this->payload->debitAccount['id'] : null),
                ($this->payload->debitType == 'Till' ? $this->payload->debitAccount['id'] : null),
                ($this->payload->debitType == 'Employee' ? $this->payload->debitAccount['id'] : null),
                ($this->payload->debitType == 'Expense' || $this->payload->debitType == 'Income' ? $this->payload->debitAccount['id'] : null),
                $this->payload->debitType,
            );
        return $this;
    }

    public function bankDebit(): self
    {
        (new BankActions($this->payload->debitAccount['id']))
            ->debitAccount(
                $this->payload->debitCurrency['id'],
                $this->payload->amount,
            )
            ->createDebitStatement(
                'DEBIT-TO-' . strtoupper($this->payload->creditType),
                $this->payload->amount,
                null,
                $this->payload->remarks,
                $this->payload->creditCurrency['id'],
                $this->payload->exchange_rate,
                $this->payload->exchanged_amount,
                $this->payload->creditType == 'Customer' ? $this->payload->creditAccount['id'] : null,
                $this->payload->creditType == 'Till' ? $this->payload->creditAccount['id'] : null,
                $this->payload->creditType == 'Employee' ? $this->payload->creditAccount['id'] : null,
                $this->payload->creditType == 'Expense' || $this->payload->creditType == 'Income' ? $this->payload->creditAccount['id'] : null,
                $this->payload->creditType,
            );
        return $this;
    }

    public function expenseCredit(): self
    {
        if ($this->debitType != 'Till' || $this->debitType != 'Bank' || $this->debitType != 'Extra') {
        }
        return $this;
    }

    public function incomeDebit(): self
    {

        return $this;
    }
}
