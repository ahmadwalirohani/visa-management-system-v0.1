<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisaSubType extends Model
{
    use HasFactory;

    public function setData(object |array $data): self
    {
        $this->name = $data->name;
        $this->code = $data->code;
        $this->visa_type_id = $data->visa_type_id;

        return $this;
    }
}
