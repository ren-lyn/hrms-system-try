<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobPostStoreRequest extends FormRequest
{
	public function authorize(): bool { return true; }
	public function rules(): array {
		return [
			'title' => ['required','string','max:150'],
			'description' => ['required','string'],
			'requirements' => ['nullable','string'],
		];
	}
}