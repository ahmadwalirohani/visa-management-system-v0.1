<?php

namespace App\Models;

use App\Casts\CarbonToJalaliCast;
use App\Enums\VisaStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

class Visa extends Model
{
    use HasFactory;

    protected $casts = [
        "created_at" => CarbonToJalaliCast::class,
        "booked_date" => CarbonToJalaliCast::class,
        "ordered_date" => CarbonToJalaliCast::class,
    ];

    public function scopeGetPending($query): void
    {
        $query->where('status', '!=', VisaStatus::COMPLETED);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function scopeWithCustomer($query): void
    {
        $query->with('customer');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class)->select(['id', 'name', 'symbol']);
    }

    public function scopeWithCurrency($query): void
    {
        $query->with('currency');
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(VisaType::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function history(): HasMany
    {
        return $this->hasMany(CustomerLedger::class, 'visa_id')->with(['currency']);
    }

    public function proceed_visa(): HasOne
    {
        return $this->hasOne(ProcessedVisa::class)->select(['id', 'visa_id', 'serial_no', 'residence']);
    }

    public function entrance_type(): BelongsTo
    {
        return $this->belongsTo(VisaSubType::class, 'entrance_type_id');
    }

    public function scopeWithProceedVisa($query): void
    {
        $query->with('proceed_visa');
    }

    public function scopeWithType($query): void
    {
        $query->with('type');
    }

    public function scopeWithBranch($query): void
    {
        $query->with('branch');
    }
    public function scopeWithEntranceType($query): void
    {
        $query->with('entrance_type');
    }

    public function scopeWithHistory($query): void
    {
        $query->with('history');
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(VisaExpense::class)->select(['id', 'amount', 'currency_id', 'name', 'visa_id'])->with('currency');
    }

    public function scopeWithExpenses($query): void
    {
        $query->with('expenses');
    }

    public function scopeFilter($query, object $payload): void
    {
        $query
            ->when(isset($payload->c) && $payload->c != "" && $payload->c != null, function ($query) use ($payload) {
                $query->whereCustomerId($payload->c);
            })
            ->when(isset($payload->cu) && $payload->cu != "" && $payload->cu != null, function ($query) use ($payload) {
                $query->whereCurrencyId($payload->cu);
            })
            ->when(isset($payload->t) && $payload->t != 0 && $payload->t != null, function ($query) use ($payload) {
                $query->whereTypeId($payload->t);
            })
            ->when(isset($payload->b) && $payload->b != 0 && $payload->b != null, function ($query) use ($payload) {
                $query->whereBranchId($payload->b);
            })
            ->when(isset($payload->type), function ($query) use ($payload) {
                if ($payload->type == 'remaining') $query->whereRaw(DB::raw('paid_amount < price'));
                else if ($payload->type == 'paid') $query->whereRaw(DB::raw('paid_amount == price'));
            })
            ->when($payload->se != 0 && $payload->se && $payload->se != null, function ($query) use ($payload) {
                $query->whereRaw(DB::raw('passport_no LIKE ? OR remarks LIKE ? OR name LIKE ? OR block_no LIKE ? OR visa_no LIKE ?'), ["%" . $payload->se . "%", "%" . $payload->se . "%", "%" . $payload->se . "%", "%" . $payload->se . "%", "%" . $payload->se . "%"]);
            })
            ->when(isset($payload->s) && $payload->s, function ($query) use ($payload) {
                if ($payload->s == 'cancelled') $query->where('is_canceled', 1);
                else $query->whereStatus($payload->s)->where('is_canceled', 0);
            });
    }

    public function scopeGetNonProcessed($query): void
    {
        $query->whereStatus(VisaStatus::ORDERED);
    }

    public function scopeGetProcessed($query): void
    {
        $query->whereStatus(VisaStatus::COMPLETED);
    }
}
