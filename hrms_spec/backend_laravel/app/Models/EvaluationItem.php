<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationItem extends Model
{
	use HasFactory;
	protected $fillable = ['evaluation_id','category','question','score','comment'];
	public function evaluation() { return $this->belongsTo(Evaluation::class); }
}