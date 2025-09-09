<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
	use Notifiable;
	protected $fillable = ['name','email','password','role','is_active'];
	protected $hidden = ['password','remember_token'];
	public function employee() { return $this->hasOne(Employee::class); }
}