<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateVisaTypeEntranceRequest extends FormRequest
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
            "visa_type_id" => "required|numeric|min:1",
            "code" => "required|string|max:255|unique:visa_sub_types,code"  . (request()->input('is_update') ? ',' . request()->input("type_id") . ',id' : ''),
        ];
    }

    public function messages(): array
    {
        return [
            'code.unique' => 'د ویزي نوعیت دخول کود باید تکراري نه وي',
        ];
    }
}
