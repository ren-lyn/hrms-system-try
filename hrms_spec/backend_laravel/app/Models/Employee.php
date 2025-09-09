<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
	use HasFactory;

	protected $fillable = [
		'user_id','dept_id','position_id','manager_employee_id','employee_no','nickname','age','birthdate','birthplace','contact_no','present_address','hire_date','tenure_months','sss_no','phic_no','pagibig_no','tin_no','civil_status','employment_status','termination_date','termination_reason','termination_remarks','base_hourly_rate','name_change_count'
	];

	public function user() { return $this->belongsTo(User::class); }
	public function department() { return $this->belongsTo(Department::class, 'dept_id'); }
	public function position() { return $this->belongsTo(Position::class, 'position_id'); }
	public function manager() { return $this->belongsTo(Employee::class, 'manager_employee_id'); }
	public function attendances() { return $this->hasMany(Attendance::class); }
	public function payrollItems() { return $this->hasMany(PayrollItem::class); }
	public function leaveRequests() { return $this->hasMany(LeaveRequest::class); }
	public function evaluations() { return $this->hasMany(Evaluation::class); }
	public function disciplinaryActions() { return $this->hasMany(DisciplinaryAction::class); }
	public function benefits() { return $this->hasMany(Benefit::class); }
}