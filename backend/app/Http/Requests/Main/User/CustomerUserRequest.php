<?php

namespace App\Http\Requests\Main\User;

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
    public function rules()
    {
        return [
            'name' => ['string', 'max:255'],
            'last_name' => ['string', 'max:255'],
            'mobile' => ['string', 'max:15'],
            'email' => [
                'email',
                'max:255',
                Rule::unique('users')->ignore(auth()->id()), // اطمینان از یکتا بودن ایمیل، به جز برای کاربر فعلی
            ],
            'national_code'=> ['string', 'max:15'],
        ];
    }
}
