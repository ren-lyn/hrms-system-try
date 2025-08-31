<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'hr_staff_id',
        'title',
        'description',
        'status',
    ];

    /**
     * An evaluation form belongs to the HR staff who created it.
     */
    public function hrStaff()
    {
        return $this->belongsTo(User::class, 'hr_staff_id');
    }

    /**
     * An evaluation form can have many evaluation questions.
     */
    public function questions()
    {
        return $this->hasMany(EvaluationQuestion::class, 'evaluation_form_id');
    }

    /**
     * An evaluation form can have many evaluations.
     */
    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'evaluation_form_id');
    }
}
