<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCurrencyRequest extends FormRequest
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
            'name' => 'string|required|unique:branches,name' . (request()->input('is_update') ? ',' . request()->input("currency_id") . ',id' : ''),
            'symbol' => 'required|max:255|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'د څانګي نوم باید تکراري نه وي',

        ];
    }
}
