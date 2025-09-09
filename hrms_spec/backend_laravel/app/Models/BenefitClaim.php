<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BenefitClaim extends Model
{
	use HasFactory;
	protected $fillable = ['employee_id','type','status','reason','document_url'];
	public function employee() { return $this->belongsTo(Employee::class); }
}