<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollRun extends Model
{
	use HasFactory;
	protected $fillable = ['period_start','period_end','status','created_by'];
	public function items() { return $this->hasMany(PayrollItem::class); }
}