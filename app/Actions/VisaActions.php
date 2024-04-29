<?php

namespace App\Actions;

use App\Enums\VisaStatus;
use App\Enums\VisaType;
use App\Models\CommittedVisas;
use App\Models\Currency;
use App\Models\SystemInfo;
use App\Models\Visa;
use App\Models\VisaCommit;
use App\Models\VisaExpense;
use App\Services\VisaService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;

class VisaActions extends VisaService
{
    public function __construct(Model $model)
    {
        parent::__construct($model);
    }
    public function createNewVisa(object $basicVisaInfo): self
    {
        $this->setBranchId($basicVisaInfo->branch)
            ->setCustomerId($basicVisaInfo->customer)
            ->setVisaTypeId($basicVisaInfo->visa_type)
            ->setVisaEntranceTypeId($basicVisaInfo->visa_entrance_type)
            ->setVisaStatus(VisaStatus::REGISTRATION)
            ->create(
                match ($basicVisaInfo->basic_type) {
                    'normal' => VisaType::NORMAL,
                    "urgent" => VisaType::URGENT,
                },
                $basicVisaInfo->currency ?? null,
                $basicVisaInfo->block_no,
                $basicVisaInfo->remarks ?? '',
                $basicVisaInfo->passport_no,
                $basicVisaInfo->province,
                $basicVisaInfo->job,
                $basicVisaInfo->name,
                $basicVisaInfo->price,
                $basicVisaInfo->advance_amount ?? 0,
            );


        return $this;
    }

    public function creditAdvanceVisaPayment(int | null $till_id, int $currency_id, float $advanceAmount, int $customer_id, string | null $remarks): self
    {
        if ($advanceAmount <= 0) return $this;
        if ($advanceAmount > 0 && $till_id <= 0)
            return response()->json(['message' => 'په پیشکي رسید کي باید دخل انتخاب سوي وي'], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);


        $tillActions = new TillActions($till_id);
        $tillActions->creditAccount($currency_id, $advanceAmount)
            ->financialService->setCustomerId($customer_id);

        $tillActions->createCreditStatement(
            'VISA-ADVANCE-PAYMENT',
            $advanceAmount,
            $this->visa_id,
            $remarks,
            null,
            0,
            0,
            null,
            null,
            null,
            null,
            'visa'
        );

        return $this;
    }

    public function updateVisaNo(): self
    {
        $_sys = SystemInfo::find(1);
        $_sys->visa_no += 1;
        $_sys->save();

        return $this;
    }

    public function editVisa(object $basicVisaInfo): self
    {
        $this->setBranchId($basicVisaInfo->branch)
            ->setCustomerId($basicVisaInfo->customer)
            ->setVisaTypeId($basicVisaInfo->visa_type)
            ->setVisaEntranceTypeId($basicVisaInfo->visa_entrance_type)
            ->setVisaId($basicVisaInfo->id)
            ->edit(
                match ($basicVisaInfo->basic_type) {
                    'normal' => VisaType::NORMAL,
                    "urgent" => VisaType::URGENT,
                },
                $basicVisaInfo->currency ?? null,
                $basicVisaInfo->block_no,
                $basicVisaInfo->remarks ?? '',
                $basicVisaInfo->passport_no,
                $basicVisaInfo->province,
                $basicVisaInfo->job,
                $basicVisaInfo->name,
                $basicVisaInfo->price,
            );


        return $this;
    }

    public static function bookedVisaStatus(int $visa_id, string $booked_date): void
    {
        Visa::whereId($visa_id)->update([
            'status' =>  VisaStatus::BOOKED,
            'booked_date' => $booked_date,
        ]);
    }

    public function orderedVisaStatus(int $visa_id): self
    {
        $this->setVisaId($visa_id)
            ->changeStatus(VisaStatus::ORDERED);

        return $this;
    }

    public function addVisaExpenses(object | array $expenses): self
    {
        foreach ($expenses as $expense) {
            $expense = (object) $expense;

            $this->createExpense(new VisaExpense(), $expense->id, $expense->expense_type, floatval($expense->expense_amount));
        }

        return $this;
    }

    public static function cancelVisa(int $visa_id, string $reason): void
    {
        Visa::whereId($visa_id)->update([
            'is_canceled' => (int) VisaStatus::CANCELED->value,
            'cancel_reason' => $reason,
        ]);
    }

    public function createProcessedVisas(object | array $visas): self
    {
        $defaultCurrency = Currency::getDefault()->first()->id;
        foreach ($visas as $visa) {
            $visa = (object) $visa;

            $this->setVisaId($visa->id)
                ->proceedVisa($visa->price, $visa->expense)
                ->createProceedVisa($visa->profit, $visa->expense, $defaultCurrency, $visa->serial_no ?? '', $visa->residence ?? '')
                ->stebalizeVisaExpense($visa->expenses, collect($visa->expenses)->pluck('id')->toArray());

            $this->debitVisaChargesToCustomer(
                $visa->customer_id,
                $visa->currency_id,
                $visa->price,
                $visa->id,
            );

            if ($visa->advance_payment > 0) $this->creditVisaAdvancePaymentToCustomer(
                $visa->customer_id,
                $visa->currency_id,
                $visa->advance_payment,
                $visa->id
            );
        }

        return $this;
    }

    public function deductExpensesFromTill(int $till_id, object | array $expenses, string $visaIDs): self
    {
        $tillActions = new TillActions($till_id);

        foreach ($expenses as $expense) {
            $expense = (object) $expense;


            $tillActions->debitAccount($expense->currency_id, $expense->amount)
                ->financialService->setRemarks($visaIDs);

            $tillActions->createDebitStatement(
                'VISA-EXPENSES',
                $expense->amount,
            );
        }

        return $this;
    }

    public function debitVisaChargesToCustomer(int $customer_id, int $currency_id, float $amount, int $visa_id): self
    {
        (new CustomerAccountingActions($customer_id))
            ->creditAccount($currency_id, $amount)
            ->createCreditStatement(
                'VISA-CHARGES',
                $amount,
                $visa_id,
                '',
            );

        return $this;
    }

    public function creditVisaAdvancePaymentToCustomer(int $customer_id, int $currency_id, float $amount, int $visa_id): self
    {
        (new CustomerAccountingActions($customer_id))
            ->debitAccount($currency_id, $amount)
            ->createDebitStatement(
                'VISA-ADVANCE-PAYMENT',
                $amount,
                $visa_id,
                '',
            );

        return $this;
    }

    public function addVisaDiscount(int $id, float $discount): self
    {
        $visa  = Visa::find($id);
        $visa->discount_amount += $discount;
        $visa->paid_amount += $discount;
        $visa->save();

        return $this;
    }

    public function createVisaDiscountStatement(int $customer_id, int $currency_id, int $visa_id, float $discount, string | null $remarks): self
    {
        (new CustomerAccountingActions($customer_id))
            ->debitAccount($currency_id, $discount)
            ->createDebitStatement(
                'VISA-DISCOUNT',
                $discount,
                $visa_id,
                $remarks ?? '',
            );

        return $this;
    }

    public function commitVisaToCustomer(int $customer, string $name, array | object $visas, int $visa_count, string | null $image, string | null $remarks): void
    {

        $committed  = (new VisaCommit())->setData((object)[
            'customer' => $customer,
            'name' => $name,
            'image' => $image,
            'remarks' => $remarks,
        ]);
        $committed->save();

        foreach ($visas as $visa) {
            (new CommittedVisas())->setData((object)[
                'id' => $committed->id,
                'visa_id' => $visa
            ])->save();

            Visa::whereId($visa)->update([
                'is_commited' => true
            ]);
        }
    }
}
