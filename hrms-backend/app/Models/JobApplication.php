<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_posting_id', 'applicant_id', 'resume_path', 'status'
    ];

    public function jobPosting()
    {
        return $this->belongsTo(\App\Models\JobPosting::class, 'job_posting_id');
    }

    public function applicant()
    {
        return $this->belongsTo(\App\Models\User::class, 'applicant_id');
    }
}