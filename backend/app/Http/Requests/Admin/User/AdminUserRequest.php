<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AdminUserRequest extends FormRequest
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

    //   protected function prepareForValidation()
    // {
    //     // لاگ کردن داده‌های خام ارسالی
    //     Log::info('Received request data in StoreAdminUserRequest:', [
    //         'input' => $this->all(),
    //         'permissions' => $this->input('permissions'),
    //         'roles' => $this->input('roles'),
    //     ]);
    // }
      public function rules()
    {
        $userId = $this->route('adminuser');
        $isStore = $this->isMethod('post'); // تشخیص store (POST) یا update (PUT/PATCH)

        $rules = [
            'name' => ['required', 'string', 'min:3'],
            'last_name' => ['required', 'string', 'min:2'],
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
            'birthdate'=>['nullable'],
            'national_code'=>['nullable'],
            'permissions' => [
                'nullable',
                'array',
                Rule::exists('permissions', 'id'),
            ],
            'roles' => [
                'nullable',
                'array',
                Rule::exists('roles', 'id'),
            ],
        ];

        // قانون سفارشی برای رمز عبور
        $passwordRules = [
            'string',
            'min:8',
            function ($attribute, $value, $fail) {
                $errors = [];

                if (!preg_match('/[A-Z]/', $value)) {
                    $errors[] = 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد.';
                }
                if (!preg_match('/[a-z]/', $value)) {
                    $errors[] = 'رمز عبور باید حداقل یک حرف کوچک داشته باشد.';
                }
                if (!preg_match('/[0-9]/', $value)) {
                    $errors[] = 'رمز عبور باید حداقل یک عدد داشته باشد.';
                }
                if (!preg_match('/[@$!%*?&+-]/', $value)) {
                    $errors[] = 'رمز عبور باید حداقل یک علامت خاص (@$!%*?&+-) داشته باشد.';
                }

                if (!empty($errors)) {
                    foreach ($errors as $error) {
                        $fail($error);
                    }
                }
            },
        ];
        $confirmPasswordRules = ['same:password'];

        // برای store: رمز عبور و تأیید آن اجباری
        if ($isStore) {
            $rules['password'] = array_merge(['required'], $passwordRules);
            $rules['confirm_password'] = array_merge(['required'], $confirmPasswordRules);
        } else {
            // برای update: رمز عبور و تأیید آن اختیاری
            $rules['password'] = array_merge(['nullable'], $passwordRules);
            $rules['confirm_password'] = array_merge(['nullable'], $confirmPasswordRules);
        }

        return $rules;
    }
}
