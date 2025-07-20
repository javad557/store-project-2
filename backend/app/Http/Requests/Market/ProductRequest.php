<?php

namespace App\Http\Requests\Market;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
           'name' => ['required', 'string', 'max:555'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'price' => ['required', 'numeric', 'digits_between:0,10'],
            'description' => ['nullable', 'string'],
            'marketable' => ['integer', 'in:0,1'],
            'publish_date' => ['nullable', 'date', 'after_or_equal:today'], // اختیاری
        ];
    }

      public function messages()
    {
        return [
    'name.required' => 'نام محصول الزامی است.',
            'name.string' => 'نام محصول باید رشته باشد.',
            'name.max' => 'نام محصول نمی‌تواند بیشتر از 255 کاراکتر باشد.',
            'category_id.required' => 'شناسه دسته‌بندی الزامی است.',
            'category_id.exists' => 'دسته‌بندی انتخاب‌شده معتبر نیست.',
            'brand_id.required' => 'شناسه برند الزامی است.',
            'brand_id.exists' => 'برند انتخاب‌شده معتبر نیست.',
            'price.required' => 'قیمت محصول الزامی است.',
            'price.numeric' => 'قیمت باید یک عدد باشد.',
            'price.digits_between' => 'قیمت نمی‌تواند بیشتر از 10 رقم باشد.',
            'description.max' => 'توضیحات نمی‌تواند بیشتر از 1000 کاراکتر باشد.',
            'marketable.required' => 'وضعیت قابل‌فروش بودن الزامی است.',
            'marketable.integer' => 'وضعیت قابل‌فروش بودن باید عدد باشد.',
            'marketable.in' => 'وضعیت قابل‌فروش بودن باید 0 یا 1 باشد.',
            'published_at.required' => 'تاریخ انتشار الزامی است.',
            'published_at.date' => 'تاریخ انتشار باید معتبر باشد.',
            'published_at.after_or_equal' => 'تاریخ انتشار نمی‌تواند قبل از امروز باشد.',
        ];
    }

      protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'error' => $validator->errors()->first(),
        ], 422));
    }
}
