<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BenefitContribution extends Model
{
	protected $fillable = ['employee_id','period_start','period_end','type','amount','source'];
}