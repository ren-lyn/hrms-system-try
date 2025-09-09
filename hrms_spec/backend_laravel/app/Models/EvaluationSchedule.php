<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationSchedule extends Model
{
	protected $fillable = ['employee_id','period_start','period_end','scheduled_at','status','created_by'];
}