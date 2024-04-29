<?php

namespace App\Models;

use App\Casts\CarbonToJalaliCast;
use App\Casts\Json;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class UserLogs extends Model
{
    use HasFactory;

    protected $casts = [
        'created_at' => CarbonToJalaliCast::class,
        'action_details' => Json::class,
    ];

    public function setData(object | array $payloud): self
    {
        $this->user_id = auth()->user()->id;
        $this->branch_id = $payloud->branch;
        $this->action_type = $payloud->action_type;
        $this->details = $payloud->details;
        $this->type = $payloud->type;
        $this->action_details = $payloud->action_details;

        return $this;
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class)->select(['id', 'name']);
    }

    public function scopeWithBranch($query): void
    {
        $query->with('branch');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->select(['id', 'name', 'email']);
    }

    public function scopeWithUser($query): void
    {
        $query->with('user');
    }

    public function scopeFilter($query, $payload): void
    {
        $query->whereBetween(DB::raw('DATE(created_at)'), [
            $payload->sd,
            $payload->ed
        ]);
    }
}
