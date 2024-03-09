<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateEICodeRequest extends FormRequest
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
            'code' => 'string|required|unique:e_i_codes,code' . (request()->input('is_update') ? ',' . request()->input("eicode_id") . ',id' : ''),
            'name' => 'required|max:255|string',
        ];
    }

    public function messages(): array
    {
        return [
            'code.unique' => 'د کود باید تکراري نه وي',
        ];
    }
}
