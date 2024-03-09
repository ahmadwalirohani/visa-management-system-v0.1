<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VisaType extends Model
{
    use HasFactory;

    public function setData(object | array $data): self
    {
        $this->name  = $data["name"];
        $this->code =  $data['code'];

        return $this;
    }

    public function entrance_types(): HasMany
    {
        return $this->hasMany(VisaSubType::class, 'visa_type_id');
    }

    public function scopeWithEntranceTypes($query): void
    {
        $query->with('entrance_types');
    }
}
