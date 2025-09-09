<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
	use HasFactory;
	protected $fillable = ['job_id','applicant_user_id','status','interview_date','resume_url','other_docs_url'];
	public function job() { return $this->belongsTo(JobPost::class, 'job_id'); }
	public function applicantUser() { return $this->belongsTo(User::class, 'applicant_user_id'); }
}