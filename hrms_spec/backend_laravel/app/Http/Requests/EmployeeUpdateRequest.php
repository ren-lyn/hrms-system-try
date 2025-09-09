<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeUpdateRequest extends FormRequest
{
	public function authorize(): bool { return true; }
	public function rules(): array {
		return [
			'dept_id' => ['nullable','integer'],
			'position_id' => ['nullable','integer'],
			'contact_no' => ['nullable','string','max:60'],
			'present_address' => ['nullable','string','max:255'],
			'employment_status' => ['nullable','in:Full-time,Part-time,Probationary,Contractual,Project-based,Intern/Trainee,Retired,Resigned,On leave'],
			'base_hourly_rate' => ['nullable','numeric','min:0'],
		];
	}
}