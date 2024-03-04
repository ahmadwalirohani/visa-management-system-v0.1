<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBranchRequest extends FormRequest
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
            'name' => 'string|required|unique:branches,name' . (request()->input('is_update') ? ',' . request()->input("branch_id") . ',id' : ''),
            'address' => 'required|max:255|string',
            'admin' => 'required|max:255|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'د څانګي نوم باید تکراري نه وي',

        ];
    }
}
