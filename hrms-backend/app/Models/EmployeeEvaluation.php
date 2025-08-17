<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeEvaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'evaluator_id',
        'evaluation_date',
        'job_title',
        'date_hired',
        'date_last_increased',
        'beginning_rate',
        'present_rate',
        'rate_per_hour',
        'punctuality_attendance',
        'attitude',
        'quality_of_work',
        'initiative',
        'teamwork',
        'trustworthy',
        'remarks',
        'total_score',
        'status',
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function evaluator()
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }
}
