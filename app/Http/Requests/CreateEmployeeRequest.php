<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required|string|max:255",
            "phone" => "required|string|max:11",
            "code" => "required|unique:employees,code" . (request()->input('is_update') ? ',' . request()->input("Employee_id") . ',id' : ''),
            "branch" => "required|min:1|numeric",
            "salary" => "required|min:1|numeric",
            "job" => "required|string|max:255",
            "balancies" => "required|array",
        ];
    }
}
