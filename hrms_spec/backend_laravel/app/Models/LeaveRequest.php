<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
	use HasFactory;
	protected $fillable = ['employee_id','type','start_date','end_date','status','approver_employee_id','reason','exported_form_url'];
	public function employee() { return $this->belongsTo(Employee::class); }
	public function approver() { return $this->belongsTo(Employee::class, 'approver_employee_id'); }
}