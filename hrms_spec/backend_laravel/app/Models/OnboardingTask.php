<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnboardingTask extends Model
{
	use HasFactory;
	protected $fillable = ['employee_id','task','status','due_date','document_url'];
	public function employee() { return $this->belongsTo(Employee::class); }
}