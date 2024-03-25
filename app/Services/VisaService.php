<?php

namespace App\Services;

use App\Enums\VisaStatus;
use App\Enums\VisaType;
use App\Models\ProcessedVisa;
use App\Models\SystemInfo;
use App\Models\Visa;
use App\Models\VisaExpense;
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

    protected function create(
        VisaType $visaType,
        int | null $currency_id,
        string | null $block_no,
        string $remarks,
        string $passport_no,
        string $province,
        string $job,
        string | null $name,
        float $price,
        float $advance_payment = 0
    ): self {


        $this->visaModel->currency_id = $currency_id;
        $this->visaModel->block_no = is_string($block_no) ? $block_no : null;
        $this->visaModel->passport_no = $passport_no;
        $this->visaModel->province = $province;
        $this->visaModel->remarks = is_string($remarks) ? $remarks : null;
        $this->visaModel->basic_type = $visaType;
        $this->visaModel->job = $job;
        $this->visaModel->name = $name;
        $this->visaModel->price = $price;
        $this->visaModel->paid_amount = $advance_payment ?? 0;
        $this->visaModel->status = $this->status;


        $this->visaModel->visa_no = SystemInfo::whereId(1)->first()->visa_no;
        $this->setDefaultAttributes();

        $this->visa_id = $this->visaModel->getConnection()->getPdo()->lastInsertId();

        return $this;
    }

    protected function edit(VisaType $visaType, int | null $currency_id, string | null $block_no, string $remarks, string $passport_no, string $province, string $job, string | null $name, float $price): self
    {


        $this->visaModel->currency_id = $currency_id;
        $this->visaModel->block_no = is_string($block_no) ? $block_no : null;
        $this->visaModel->passport_no = $passport_no;
        $this->visaModel->province = $province;
        $this->visaModel->remarks = is_string($remarks) ? $remarks : null;
        $this->visaModel->basic_type = $visaType;
        $this->visaModel->job = $job;
        $this->visaModel->name = $name;
        $this->visaModel->price = $price;

        $this->setDefaultAttributes();

        return $this;
    }

    protected function createExpense(Model $expenseModel, int $currency_id, string | null $name, float $amount): self
    {
        $expenseModel->name = $name ?? '';
        $expenseModel->currency_id = $currency_id;
        $expenseModel->amount = $amount;
        $expenseModel->visa_id = $this->visa_id;
        $expenseModel->created_user_id = auth()->user()->id;

        $expenseModel->save();

        return $this;
    }

    protected function changeStatus(VisaStatus $visaStatus): self
    {
        $this->visaModel = Visa::find($this->visa_id);
        $this->visaModel->status = $visaStatus;
        $this->visaModel->ordered_date = now();
        $this->visaModel->save();

        return $this;
    }

    private function setDefaultAttributes(): void
    {
        $this->visaModel->type_id = $this->visa_type_id;
        $this->visaModel->entrance_type_id = $this->visa_entrance_type_id;
        $this->visaModel->customer_id = $this->customer_id;
        $this->visaModel->branch_id = $this->branch_id;
        $this->visaModel->created_user_id = auth()->user()->id;
        $this->visaModel->save();
    }

    protected function createProceedVisa(float $price, float $expense, int $currency_id, string $serial_no, string $residence): self
    {
        $visa = new ProcessedVisa();
        $visa->price = $price;
        $visa->expenses = $expense;
        $visa->profit = $price - $expense;
        $visa->currency_id = $currency_id;
        $visa->serial_no = $serial_no;
        $visa->residence = $residence;
        $visa->visa_id = $this->visa_id;
        $visa->created_user_id = auth()->user()->id;
        $visa->save();

        return $this;
    }

    protected function proceedVisa(float $price, float $expense_amount): self
    {
        $this->visaModel = Visa::find($this->visa_id);
        $this->visaModel->price = $price;
        $this->visaModel->expense_amount = $expense_amount;
        $this->visaModel->status = VisaStatus::COMPLETED;
        $this->visaModel->save();

        return $this;
    }

    protected function stebalizeVisaExpense(object | array $expenses, array $expenseIDs): self
    {
        foreach ($expenses as $expense) {
            $expense  = (object) $expense;
            $expenseModel = VisaExpense::find($expense->id);
            $expenseModel->currency_id = $expense->currency_id;
            $expenseModel->amount = $expense->amount;
            $expenseModel->name = $expense->name;
            $expenseModel->save();
        }

        VisaExpense::whereNotIn('id', $expenseIDs)->whereVisaId($this->visa_id)->delete();

        return $this;
    }

    protected function setCustomerId(int $id): self
    {
        $this->customer_id = $id;

        return $this;
    }

    protected function setVisaId(int $id): self
    {
        $this->visa_id = $id;

        $this->visaModel = Visa::find($this->visa_id);

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
