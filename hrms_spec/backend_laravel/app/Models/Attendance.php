<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
	use HasFactory;
	protected $table = 'attendance';
	protected $fillable = ['employee_id','date','time_in','time_out','status','source'];
	public function employee() { return $this->belongsTo(Employee::class); }
}