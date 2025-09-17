<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class DeliveryRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:255',
                // اگر نیاز به یکتا بودن نام روش ارسال دارید، می‌تونید اضافه کنید:
                // Rule::unique('deliveries')->ignore($this->route('id')), // برای update
                // Rule::unique('deliveries'), // برای store
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0',
            ],
            'delivery_time' => [
                'required',
                'string',
                'max:255',
            ],
        ];
    }

}
