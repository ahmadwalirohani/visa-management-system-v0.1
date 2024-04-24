<?php

namespace App\Models;

use App\Casts\CarbonToJalaliCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class EmployeeLedger extends Model
{
    use HasFactory;

    protected $casts = [
        'created_at' =>  CarbonToJalaliCast::class,
    ];

    public function setData(object|array $transaction): self
    {

        $this->transactionType = $transaction->transactionType;
        $this->credit_amount = $transaction->credit_amount;
        $this->debit_amount = $transaction->debit_amount;
        $this->balance = $transaction->balance;
        $this->currency_id = $transaction->currency_id;
        $this->ex_currency_id = $transaction->ex_currency_id;
        $this->exchange_rate = $transaction->exchange_rate;
        $this->exchange_amount = $transaction->exchange_amount;
        $this->employee_id = $transaction->employee_id;
        $this->till_id = $transaction->till_id;
        $this->bank_id = $transaction->bank_id;
        $this->remarks = $transaction->remarks;
        $this->created_user_id = auth()->user()->id;

        return $this;
    }


    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function ex_currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'ex_currency_id');
    }

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }

    public function till(): BelongsTo
    {
        return $this->belongsTo(Till::class);
    }



    public function scopeGetLedgerRelations($query): void
    {
        $query->with([
            'till',
            'bank',
            'currency',
            'ex_currency',
        ]);
    }

    public function scopeFilter($query, object | array $payload): void
    {
        $query
            ->when($payload->c && !empty($payload->c), function ($query) use ($payload) {
                $query->whereIn('currency_id', $payload->c);
            })
            // ->when($payload->t != 0 && $payload->t != null, function ($query) use ($payload) {
            //     $query->whereRaw(DB::raw('transactionType LIKE ?'), ["%" . strtoupper($payload->t) . "%",]);
            // })
            ->whereBetween(DB::raw('DATE(created_at)'), [
                $payload->sd,
                $payload->ed
            ])
            ->whereEmployeeId($payload->em);
    }
}
