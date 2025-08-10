<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerUserRequest extends FormRequest
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
         $userId = $this->route('customeruser'); // دریافت id از مسیر درخواست
            return [
            'name' => 'required|string|min:3',
            'last_name' => 'required|string|min:2',
            'email' => [
                'required_without:mobile',
                'nullable',
                'email',
                Rule::unique('users', 'email')->ignore($userId, 'id')->whereNull('deleted_at'),
            ],
            'mobile' => [
                'required_without:email',
                'nullable',
                'digits:11',
                Rule::unique('users', 'mobile')->ignore($userId, 'id')->whereNull('deleted_at'),
            ],
              'password' => [
                'nullable',
                'string',
                'min:6',
                'confirmed',
                function ($attribute, $value, $fail) {
                    if ($value === null) {
                        return; // اگر رمز عبور null باشه، بررسی‌های اضافی لازم نیست
                    }
                    $errors = [];
                    if (!preg_match('/[A-Z]/', $value)) {
                        $errors[] = 'رمز عبور باید حداقل شامل یک حرف بزرگ باشد.';
                    }
                    if (!preg_match('/[a-z]/', $value)) {
                        $errors[] = 'رمز عبور باید حداقل شامل یک حرف کوچک باشد.';
                    }
                    if (!preg_match('/[0-9]/', $value)) {
                        $errors[] = 'رمز عبور باید حداقل شامل یک عدد باشد.';
                    }
                    if (!preg_match('/[\W_]/', $value)) {
                        $errors[] = 'رمز عبور باید حداقل شامل یک علامت خاص (مثل +, *, یا () باشد.';
                    }
                    if (!empty($errors)) {
                        foreach ($errors as $error) {
                            $fail($error);
                        }
                    }
                },
            ],
            'password_confirmation' => ['nullable', 'string'],
        ];
    }
}
