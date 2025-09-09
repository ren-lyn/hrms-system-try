<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EvaluationStoreRequest extends FormRequest
{
	public function authorize(): bool { return true; }
	public function rules(): array {
		return [
			'employee_id' => ['required','integer'],
			'period_start' => ['required','date'],
			'period_end' => ['required','date','after_or_equal:period_start'],
			'total_score' => ['required','integer','min:0','max:100'],
			'pass_threshold' => ['required','integer','min:0','max:100'],
			'items' => ['required','array','min:1'],
			'items.*.category' => ['required','string','max:120'],
			'items.*.question' => ['required','string','max:255'],
			'items.*.score' => ['required','integer','min:1','max:10'],
			'items.*.comment' => ['nullable','string'],
		];
	}
}