<?php

namespace App\Http\Requests\Admin\Marketing;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class BannerRequest extends FormRequest
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
         $imageRule = $this->method() === 'POST' ? 'required|image|mimes:jpeg,jpg,png|max:2048' : 'nullable|image|mimes:jpeg,jpg,png|max:2048';
        return [
            'title'=>['required','string','min:2'],
            'image'=>$imageRule,
            'url'=>['nullable','string'],
            'position'=>['required','integer']
        ];
    }
 
      protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'error' => $validator->errors()->first(),
        ], 422));
    }
}
