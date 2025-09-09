<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeRecurringDeduction extends Model
{
	protected $fillable = ['employee_id','deduction_title_id','amount','start_date','end_date'];
}