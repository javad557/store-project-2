<?php

namespace App\Http\Requests\Market;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class VariantManagementRequest extends FormRequest
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
            'action' => 'required|in:add,delete',
            'combinations' => 'required|array|min:1',
            'combinations.*.color' => 'required|string',
            'combinations.*.attribute' => 'required_if:action,add|array',
            'combinations.*.value' => 'required_if:action,add|integer|min:0',
            'combinations.*.price_increase' => 'required_if:action,add|integer|min:0',
            'forbiddenCombinations' => 'nullable|array',
            'forbiddenCombinations.*' => 'array',
        ];
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'action.required' => 'فیلد action الزامی است.',
            'action.in' => 'فیلد action باید add یا delete باشد.',
            'combinations.required' => 'فیلد combinations الزامی است.',
            'combinations.array' => 'فیلد combinations باید آرایه باشد.',
            'combinations.min' => 'حداقل یک ترکیب باید ارائه شود.',
            'combinations.*.color.required' => 'فیلد color برای هر ترکیب الزامی است.',
            'combinations.*.attribute.required_if' => 'فیلد attribute برای action=add الزامی است.',
            'combinations.*.value.required_if' => 'فیلد value برای action=add الزامی است.',
            'combinations.*.value.integer' => 'فیلد value باید یک عدد صحیح باشد.',
            'combinations.*.value.min' => 'فیلد value باید بزرگ‌تر یا برابر با صفر باشد.',
            'combinations.*.price_increase.required_if' => 'فیلد price_increase برای action=add الزامی است.',
            'combinations.*.price_increase.integer' => 'فیلد price_increase باید یک عدد صحیح باشد.',
            'combinations.*.price_increase.min' => 'فیلد price_increase باید بزرگ‌تر یا برابر با صفر باشد.',
        ];
    }

       protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'error' => $validator->errors()->first(),
        ], 422));
    }
}
