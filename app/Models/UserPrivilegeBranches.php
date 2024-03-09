<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPrivilegeBranches extends Model
{
    use HasFactory;

    protected $fillable = [
        "user_id", "branch_id", "status", "privileges", "is_accountant", "is_admin", "is_normal"
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function setData(object | array $data): self
    {
        $this->branch_id = $data->branch;
        $this->user_id = $data->userId;
        $this->is_admin = false;
        $this->is_accountant = false;
        $this->is_normal = false;
        $this['is_' . $data->role] = true;

        return $this;
    }

    public function scopewithBranch($query): void
    {
        $query->with('branch');
    }
}
