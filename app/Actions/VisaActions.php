<?php

namespace App\Actions;

use App\Enums\VisaStatus;
use App\Enums\VisaType;
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
                $basicVisaInfo->remarks || '',
                $basicVisaInfo->passport_no,
                $basicVisaInfo->province,
                $basicVisaInfo->job
            );


        return $this;
    }

    public function creditAdvanceVisaPayment(int $till_id, int $currency_id, float $advanceAmount, int $customer_id, string | null $remarks): self
    {
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
}
