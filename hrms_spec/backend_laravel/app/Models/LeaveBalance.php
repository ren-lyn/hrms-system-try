<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveBalance extends Model
{
	use HasFactory;
	protected $fillable = ['employee_id','year','vacation_days','sick_days'];
	public function employee() { return $this->belongsTo(Employee::class); }
}