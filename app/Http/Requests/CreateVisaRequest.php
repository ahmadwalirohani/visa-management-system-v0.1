<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateVisaRequest extends FormRequest
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
            "visa_type" => "required|numeric|min:1",
            "visa_entrance_type" => "required|array",
            "basic_type" => "required|string|in:normal,urgent",
            "customer" => "required|array",
            "passport_no" => "required|string",
            "name" => "required|string|max:255",
            "province" => "required|string|max:255",

        ];
    }
}
