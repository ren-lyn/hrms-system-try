<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
	use HasFactory;
	protected $fillable = ['employee_id','manager_id','period_start','period_end','total_score','pass_threshold','feedback'];
	public function employee() { return $this->belongsTo(Employee::class); }
	public function manager() { return $this->belongsTo(Employee::class, 'manager_id'); }
	public function items() { return $this->hasMany(EvaluationItem::class); }
}