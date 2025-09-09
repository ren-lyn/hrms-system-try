<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveStoreRequest extends FormRequest
{
	public function authorize(): bool { return true; }
	public function rules(): array {
		return [
			'type' => ['required','in:vacation,sick,maternity,paternity,emergency,unpaid'],
			'start_date' => ['required','date'],
			'end_date' => ['required','date','after_or_equal:start_date'],
			'reason' => ['nullable','string','max:255'],
		];
	}
}