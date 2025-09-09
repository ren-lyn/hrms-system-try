<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeStoreRequest extends FormRequest
{
	public function authorize(): bool { return true; }
	public function rules(): array {
		return [
			'user_id' => ['required','integer'],
			'employee_no' => ['nullable','string','max:50'],
			'dept_id' => ['nullable','integer'],
			'position_id' => ['nullable','integer'],
			'hire_date' => ['nullable','date'],
			'base_hourly_rate' => ['nullable','numeric','min:0'],
			'contact_no' => ['nullable','string','max:60'],
			'present_address' => ['nullable','string','max:255'],
		];
	}
}