<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AllowanceTitle extends Model
{
	protected $fillable = ['name','code','amount_type','value','active'];
}