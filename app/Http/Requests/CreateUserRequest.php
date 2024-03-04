<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
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
            'email' => 'required|email|unique:users,email' . (request()->input('is_update') ? ',' . request()->input("user_id") . ',id' : ''),
            'password' => 'required|min:6|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'ایمیل ادرس باید تکراري نه وي',
            'password.min' => 'فاسورډ باید تر ۶ عدده کم نه وي',
        ];
    }
}
