<?php

namespace App\Models;

use App\Casts\CarbonToJalaliCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Customer extends Model
{
    use HasFactory;

    protected $casts = [
        'created_at' => CarbonToJalaliCast::class,
    ];

    public function setData(object | array $data): self
    {
        $this->name = $data->name;
        $this->agent_name = $data->agent_name;
        $this->province = $data->province;
        $this->email = $data->email;
        $this->phone = $data->phone;
        $this->address = $data->address;
        $this->code = $data->code;
        $this->branch_id = $data->branch;
        $this->created_user_id = auth()->user()->id;

        return $this;
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function balancies(): HasMany
    {
        return $this->hasMany(CustomerAccount::class, 'customer_id')->with('currency');
    }

    public function scopeWithBalancies($query): void
    {
        $query->with('balancies');
    }

    public function scopeWithBranch($query): void
    {
        $query->with("branch");
    }

    public function scopeAsItem($query): void
    {
        $query->select(
            env('db_connection') == 'sqlite'
                ? DB::raw('id,province,branch_id, name || "   #" || code as name')
                : DB::raw('id,province,branch_id, CONCAT(name,"     #",code) as name')
        );
    }
}
