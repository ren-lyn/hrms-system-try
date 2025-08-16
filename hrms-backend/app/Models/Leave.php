<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = ['employee_id', 'type', 'from', 'to', 'status'];

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
