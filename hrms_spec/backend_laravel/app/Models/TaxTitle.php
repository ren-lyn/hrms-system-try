<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaxTitle extends Model
{
	protected $fillable = ['name','rate_percent','active'];
}