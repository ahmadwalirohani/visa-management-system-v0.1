<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollDetails extends Model
{
    use HasFactory;

    public function setData(object | array $payload): self
    {
        $this->payroll_id = $payload->payroll_id;
        $this->employee_id = $payload->employee_id;
        $this->salary = $payload->salary;
        $this->presence_days = $payload->presence;
        $this->absence_days = $payload->absence;
        $this->tax = $payload->tax;
        $this->net_salary = $payload->net_salary;
        $this->overtime = $payload->overtime;

        return $this;
    }

    public function employee(): BelongsTo
    {
        return  $this->belongsTo(Employee::class)->withBranch()->select(['id', 'branch_id', 'code', 'phone', 'job']);
    }
}
