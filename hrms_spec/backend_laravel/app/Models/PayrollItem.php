<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollItem extends Model
{
	use HasFactory;
	protected $fillable = ['payroll_run_id','employee_id','gross_pay','tax','deductions_total','allowances_total','net_pay','details_json'];
	protected $casts = ['details_json' => 'array'];
	public function run() { return $this->belongsTo(PayrollRun::class, 'payroll_run_id'); }
	public function employee() { return $this->belongsTo(Employee::class); }
}