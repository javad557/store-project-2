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
    
        return $rules;
    }
}
