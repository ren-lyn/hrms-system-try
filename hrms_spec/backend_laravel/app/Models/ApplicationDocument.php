<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationDocument extends Model
{
	protected $fillable = ['application_id','doc_type','storage_url','uploaded_at'];
}