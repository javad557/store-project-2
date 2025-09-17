<?php

namespace App\Http\Requests\Admin\Market;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class GalleyRequest extends FormRequest
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
            'images.*' => 'required|image|mimes:jpg,jpeg,png|max:5120', // حداکثر 5MB (5120KB)
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'images.*.required' => 'لطفاً حداقل یک تصویر انتخاب کنید.',
            'images.*.image' => 'فایل باید یک تصویر باشد.',
            'images.*.mimes' => 'فقط فرمت‌های jpg، jpeg و png مجاز هستند.',
            'images.*.max' => 'حجم تصویر نباید بیشتر از ۵ مگابایت باشد.',
        ];
    }

       protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'error' => $validator->errors()->first(),
        ], 422));
    }
}
