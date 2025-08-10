<?php

namespace App\Http\Requests\User;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class PermissionRequest extends FormRequest
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
        // دریافت مدل Permission از Route Model Binding
        $permission = $this->route('permission');

        return [
              'name' => [
              'required',
              'string',
              'max:255',
              Rule::unique('permissions', 'name')->withoutTrashed()->ignore($permission?->id),
              'regex:/^[a-zA-Z\s_-]+$/', // Allow English letters, spaces, underscores, and hyphens
        ],
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
            'description' => [
                'nullable',
                'string',
                'regex:/^[\p{L}\s]*$/u', // فقط حروف و فاصله (اختیاری)
            ],
        ];
    }
}
