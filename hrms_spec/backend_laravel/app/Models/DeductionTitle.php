<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeductionTitle extends Model
{
	protected $fillable = ['name','code','amount_type','value','active'];
}