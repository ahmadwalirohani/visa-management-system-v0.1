<?php

namespace App\Models;

use App\Casts\CarbonToJalaliCast;
use App\Enums\VisaStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        $query->where('status', '!=', VisaStatus::COMPLETED)->whereIsCanceled(0);
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
        return $this->belongsTo(Currency::class);
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

    public function entrance_type(): BelongsTo
    {
        return $this->belongsTo(VisaSubType::class, 'entrance_type_id');
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

    public function scopeFilter($query, object $payload): void
    {
        $query
            ->when(isset($payload->c) && $payload->c != "" && $payload->c != null, function ($query) use ($payload) {
                $query->whereCustomerId($payload->c);
            })
            ->when($payload->t != 0 && $payload->t != null, function ($query) use ($payload) {
                $query->whereTypeId($payload->t);
            })
            ->when($payload->b != 0 && $payload->b != null, function ($query) use ($payload) {
                $query->whereBranchId($payload->b);
            })
            ->when($payload->se != 0 && $payload->se != null, function ($query) use ($payload) {
                $query->whereRaw(DB::raw('passport_no LIKE ? OR remarks LIKE ? OR name LIKE ? OR block_no LIKE ? OR visa_no LIKE ?'), ["%" . $payload->se . "%", "%" . $payload->se . "%", "%" . $payload->se . "%", "%" . $payload->se . "%", "%" . $payload->se . "%"]);
            })
            ->when(isset($payload->s) && $payload->s, function ($query) use ($payload) {
                $query->whereStatus($payload->s);
            });
    }

    public function scopeGetNonProcessed($query): void
    {
        $query->whereStatus(VisaStatus::ORDERED);
    }
}
