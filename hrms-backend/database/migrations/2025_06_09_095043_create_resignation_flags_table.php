<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResignationFlagsTable extends Migration
{
    public function up()
    {
        Schema::create('resignation_flags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employee_profiles')->onDelete('cascade');
            $table->text('flag_reason');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('resignation_flags');
    }
}
