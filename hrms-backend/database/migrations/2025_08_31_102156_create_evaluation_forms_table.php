<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('evaluation_forms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hr_staff_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();

            $table->foreign('hr_staff_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['status', 'created_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluation_forms');
    }
};

