<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationGoal extends Model
{
	protected $fillable = ['employee_id','title','description','status','weight','score','due_date'];
}