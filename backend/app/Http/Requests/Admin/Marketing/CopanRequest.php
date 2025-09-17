<?php

namespace App\Http\Requests\Admin\Marketing;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class CopanRequest extends FormRequest
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
          $id = $this->route('copan');
            Log::info('User ID for validation:', ['userId' => $id]);
        return [
           'code' => [
                'required',
                'string',
                'max:50',
             Rule::unique('copans', 'code')->whereNull('deleted_at')->ignore($id),
            ],
            'amount' => ['required', 'numeric', 'min:0'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'end_date' => ['required', 'date', 'after_or_equal:today'],
        ];
    }

      protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'error' => $validator->errors()->first(),
        ], 422));
    }
}
