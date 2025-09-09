<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisciplinaryAction extends Model
{
	use HasFactory;
	protected $fillable = ['employee_id','category','violation','explanation','decision','investigator_employee_id'];
	public function employee() { return $this->belongsTo(Employee::class); }
	public function investigator() { return $this->belongsTo(Employee::class, 'investigator_employee_id'); }
}