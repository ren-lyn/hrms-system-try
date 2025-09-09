<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplicationStoreRequest extends FormRequest
{
	public function authorize(): bool { return true; }
	public function rules(): array {
		return [
			'job_id' => ['required','integer'],
			'resume_url' => ['nullable','url'],
			'other_docs_url' => ['nullable','url'],
		];
	}
}