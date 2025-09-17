<?php

namespace App\Http\Requests\Admin\Marketing;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class AmazingRequest extends FormRequest
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
            'product_id' => [
                'required',
                'integer',
                Rule::exists('products', 'id'), // چک می‌کند که product_id در جدول products وجود داشته باشد
            ],
            'amount' => [
                'required',
                'numeric',
                'min:1',
                'max:100', // فرض می‌کنیم درصد تخفیف بین 1 تا 100 است
            ],
            'end_date' => [
                'nullable',
                'date', // باید یک تاریخ معتبر باشد (فرمت YYYY-MM-DD)
                'after_or_equal:today', // تاریخ پایان نباید قبل از امروز باشد
            ],
        ];
    }

       protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'error' => $validator->errors()->first(),
        ], 422));
    }
}
