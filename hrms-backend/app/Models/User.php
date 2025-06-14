<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
   
    use HasApiTokens, HasFactory, Notifiable; 

    protected $fillable = [
        'name', 'role_id', 'email', 'password'
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function employeeProfile()
    {
        return $this->hasOne(EmployeeProfile::class);
    }

    public function applicant()
    {
        return $this->hasOne(Applicant::class);
    }
}
