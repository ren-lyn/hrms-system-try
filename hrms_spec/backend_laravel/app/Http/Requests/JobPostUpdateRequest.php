<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobPostUpdateRequest extends FormRequest
{
	public function authorize(): bool { return true; }
	public function rules(): array {
		return [
			'title' => ['sometimes','string','max:150'],
			'description' => ['sometimes','string'],
			'requirements' => ['sometimes','string'],
			'status' => ['sometimes','in:draft,open,closed'],
		];
	}
}