<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationCriteria extends Model
{
	protected $fillable = ['category','name','is_active'];
}