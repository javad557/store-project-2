<?php

namespace App\Http\Requests\Main\User;

use App\Models\Profile\City;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerAddressRequest extends FormRequest
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
            'province_id' => ['required', 'integer', Rule::exists('provinces', 'id')],
            'city_id' => [
                'required',
                'integer',
                Rule::exists('cities', 'id'),
                // اطمینان از اینکه city_id متعلق به province_id انتخاب‌شده است
                function ($attribute, $value, $fail) {
                    $city =City::find($value);
                    if ($city && $city->province_id !== (int) $this->input('province_id')) {
                        $fail('شهر انتخاب‌شده با استان مطابقت ندارد.');
                    }
                },
            ],
            'address' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'size:10'], // کد پستی 10 رقمی
            'no' => ['required', 'max:10'],
            'unit' => ['nullable', 'max:10'], // اختیاری
            'mobile' => ['nullable', 'regex:/^09[0-9]{9}$/'], // اختیاری، فرمت شماره موبایل ایران
        ];
    }

}
