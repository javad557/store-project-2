<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
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
        $role = $this->route('role');
            // Log::info('test',['rolerequesttest'=>$role]);

        return [
              'name' => [
              'required',
              'string',
              'max:255',
              Rule::unique('roles', 'name')->withoutTrashed()->ignore($role?->id),
              'regex:/^[a-zA-Z\s_]+$/', // اجازه دادن به حروف انگلیسی، فاصله و آندرلاین
            ],
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
            'descriptions' => [
                'nullable',
                'string',
                'regex:/^[\p{L}\s]*$/u', // فقط حروف و فاصله (اختیاری)
            ],
        ];
    }
}
