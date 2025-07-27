<?php

namespace App\Http\Requests\Market;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class VariantRequest extends FormRequest
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
            'color' => 'required|string|max:255',
            'number' => 'required|integer|min:0',
            'freezed_number' => 'required|integer|min:0',
            'attributes' => 'required|array',
            'attributes.*' => 'required|string|max:255', // هر ویژگی باید رشته باشه
        ];
    }

    public function messages()
    {
        return [
            'color.required' => 'رنگ الزامی است.',
            'number.required' => 'تعداد الزامی است.',
            'number.integer' => 'تعداد باید عدد صحیح باشد.',
            'freezed_number.required' => 'تعداد سفارش فعال الزامی است.',
            'freezed_number.integer' => 'تعداد سفارش فعال باید عدد صحیح باشد.',
            'attributes.required' => 'ویژگی‌ها الزامی هستند.',
            'attributes.array' => 'ویژگی‌ها باید به‌صورت آرایه باشند.',
            'attributes.*.required' => 'هر ویژگی باید مقدار داشته باشد.',
            'attributes.*.string' => 'مقدار ویژگی باید رشته باشد.',
        ];

        
    }

      protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'error' => $validator->errors()->first(),
        ], 422));
    }
}
