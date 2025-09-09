<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeRecurringAllowance extends Model
{
	protected $fillable = ['employee_id','allowance_title_id','amount','start_date','end_date'];
}