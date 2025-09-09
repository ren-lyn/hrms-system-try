<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
	use HasFactory;
	protected $fillable = ['title','description','requirements','status','created_by'];
	public function applications() { return $this->hasMany(Application::class, 'job_id'); }
}