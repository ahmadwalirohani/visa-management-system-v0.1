<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBankRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'code' => 'required|unique:banks,code' . (request()->input('is_update') ? ',' . request()->input("bank_id") . ',id' : ''),
            'email' => 'required|email|unique:banks,email' . (request()->input('is_update') ? ',' . request()->input("bank_id") . ',id' : ''),
            'balancies' => 'required|array',
            'branch' => "required|numeric|min:1"
        ];
    }
}
