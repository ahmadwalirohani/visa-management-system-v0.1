<?php

namespace App\Actions;

use App\Enums\VisaStatus;
use App\Enums\VisaType;
use App\Models\SystemInfo;
use App\Models\Visa;
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
}
