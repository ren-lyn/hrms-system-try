<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TurnoverRisk extends Model
{
	use HasFactory;
	protected $table = 'turnover_risk';
	protected $fillable = ['employee_id','as_of_date','probability','risk_level','features_json'];
	protected $casts = ['features_json' => 'array'];
	public function employee() { return $this->belongsTo(Employee::class); }
}