<?php

namespace App\Http\Requests\Admin\Marketing;

use Illuminate\Foundation\Http\FormRequest;

class PageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // اجازه دادن به کاربرانی که مجوز create_pages دارند
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
             'title' => [
                'required',
                'max:255',
                'min:3',
            
            ],
            'body' =>  [
                'required',
                'max:5000',
                'min:3',
               
            ],
            'status' => 'nullable|in:0,1',
        ];
    }
}