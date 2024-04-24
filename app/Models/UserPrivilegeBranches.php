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
        $this->privileges = json_encode('{
    "visa": {
        "actions": {
            "add": false,
            "edit": false,
            "cancel": false,
            "add_expense": false,
            "proceed": false,
            "commit": false
        },
        "reports": {
            "pending": false,
            "proceed": false,
            "committed": false
        }
    },
    "customer": {
        "actions": {
            "add": false,
            "edit": false,
            "delete": false
        },
        "reports": {
            "list": false,
            "ledger": false
        }
    },
    "employee": {
        "actions": {
            "add": false,
            "edit": false,
            "delete": false
        },
        "reports": {
            "list": false,
            "ledger": false
        }
    },
    "bank": {
        "actions": {
            "add": false,
            "edit": false,
            "delete": false
        },
        "reports": {
            "list": false,
            "ledger": false
        }
    },
    "till": {
        "actions": {
            "add": false,
            "edit": false,
            "delete": false,
            "opening_closing": false
        },
        "reports": {
            "list": false,
            "open_closed": false
        }
    },
    "settings": {
        "users": {
            "add": false,
            "edit": false,
            "branch_control": false,
            "list": false
        },
        "branches": {
            "add": false,
            "list": false
        },
        "ei_codes": {
            "add": false,
            "list": false
        },
        "system_infos": {
            "add": false
        },
        "visa_types": {
            "add": false,
            "list": false
        },
        "currencies": {
            "add": false,
            "add_exchange_rate": false,
            "list": false
        }
    },
    "misc": {
        "add_journal_entry": false,
        "view_journal_entries": false,
        "user_logs": false,
        "balance_sheet": false,
        "ei_codes_ledger": false,
        "loans": false,
        "other_branches_control": false
    }
}');

        return $this;
    }

    public function scopewithBranch($query): void
    {
        $query->with('branch');
    }
}
