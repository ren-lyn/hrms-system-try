<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OnboardingSession extends Model
{
	protected $fillable = ['employee_id','title','description','scheduled_at','location','status'];
}