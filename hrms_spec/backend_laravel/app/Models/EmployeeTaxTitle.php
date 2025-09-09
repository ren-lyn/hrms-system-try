<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeTaxTitle extends Model
{
	protected $fillable = ['employee_id','tax_title_id','effective_date'];
	public function taxTitle() { return $this->belongsTo(TaxTitle::class, 'tax_title_id'); }
}