<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluation_form_id',
        'category',
        'question_text',
        'description',
        'order',
    ];

    /**
     * Each question belongs to an evaluation form.
     */
    public function form()
    {
        return $this->belongsTo(EvaluationForm::class, 'evaluation_form_id');
    }
}
