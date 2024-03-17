<?php

namespace App\Services;

use App\Enums\VisaStatus;
use App\Enums\VisaType;
use Illuminate\Database\Eloquent\Model;

class VisaService
{

    protected int $visa_id;
    protected int $customer_id;

    protected int $branch_id;

    protected int $visa_type_id;

    protected int $visa_entrance_type_id;

    protected VisaStatus $status;


    public function __construct(
        protected Model $visaModel,
    ) {
    }

    protected function create(VisaType $visaType, int | null $currency_id, string | null $block_no, string $remarks, string $passport_no, string $province, string $job): self
    {

        $this->visaModel->customer_id = $this->customer_id;
        $this->visaModel->status = $this->status;
        $this->visaModel->currency_id = $currency_id;
        $this->visaModel->branch_id = $this->branch_id;
        $this->visaModel->remarks = is_string($block_no) ? $block_no : null;
        $this->visaModel->passport_no = $passport_no;
        $this->visaModel->province = $province;
        $this->visaModel->remarks = is_string($remarks) ? $remarks : null;
        $this->visaModel->type_id = $this->visa_type_id;
        $this->visaModel->entrance_type_id = $this->visa_entrance_type_id;
        $this->visaModel->basic_type = $visaType;
        $this->visaModel->job = $job;
        $this->visaModel->created_user_id = auth()->user()->id;

        $this->visaModel->save();

        $this->visa_id = $this->visaModel->getConnection()->getPdo()->lastInsertId();

        return $this;
    }

    protected function setCustomerId(int $id): self
    {
        $this->customer_id = $id;

        return $this;
    }

    protected function setBranchId(int $id): self
    {
        $this->branch_id = $id;

        return $this;
    }

    protected function setVisaTypeId(int $id): self
    {
        $this->visa_type_id = $id;

        return $this;
    }

    protected function setVisaEntranceTypeId(int $id): self
    {
        $this->visa_entrance_type_id = $id;

        return $this;
    }

    protected function setVisaStatus(VisaStatus $status): self
    {
        $this->status = $status;

        return $this;
    }
}
