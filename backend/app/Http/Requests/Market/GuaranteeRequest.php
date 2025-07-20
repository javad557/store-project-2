<?php

namespace App\Http\Requests\Market;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class GuaranteeRequest extends FormRequest
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
        // Log::info('داده‌های ورودی به GuaranteeRequest:', $this->all());
         return [
            'name' => ['required', 'string', 'max:555'],
            'duration' => ['required', 'integer'],
            'price_increase' => ['required', 'integer', 'digits_between:0,10'],
        ];
    }

      public function messages()
    {
        return [
            'name.required' => 'نام محصول الزامی است.',
            'name.string' => 'نام گارانتی باید رشته باشد.',
            'name.max' => 'نام گارانتی نمی‌تواند بیشتر از 255 کاراکتر باشد.',
            'duration.required' => 'مدت زمان الزامی است.',
            'duration.integer' => 'مدت زمان گارانتی وارد شده معتبر نیست',
            'price_increase.required' => 'افزایش قیمت الزامی است.',
            'price_increase.integer' => 'افزایش قیمت وارد شده معتبر نیست.',
            'price_increase.digits_between:0,10' => 'افزایش قیمت وارد شده معتبر نیست',
        ];
    }

      protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'error' => $validator->errors()->first(),
        ], 422));
    }
}
