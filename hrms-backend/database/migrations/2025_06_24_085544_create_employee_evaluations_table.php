<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeeEvaluationsTable extends Migration
{
    public function up()
    {
        Schema::create('employee_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Employee
            $table->foreignId('evaluator_id')->constrained('users')->onDelete('cascade'); // HR Assistant
            $table->date('evaluation_date');
            $table->string('job_title')->nullable();
            $table->date('date_hired')->nullable();
            $table->date('date_last_increased')->nullable();
            $table->decimal('beginning_rate', 8, 2)->nullable();
            $table->decimal('present_rate', 8, 2)->nullable();
            $table->decimal('rate_per_hour', 8, 2)->nullable();

            // Scores
            $table->unsignedTinyInteger('punctuality_attendance')->nullable();
            $table->unsignedTinyInteger('attitude')->nullable();
            $table->unsignedTinyInteger('quality_of_work')->nullable();
            $table->unsignedTinyInteger('initiative')->nullable();
            $table->unsignedTinyInteger('teamwork')->nullable();
            $table->unsignedTinyInteger('trustworthy')->nullable();

            $table->text('remarks')->nullable(); // Optional comments
            $table->unsignedSmallInteger('total_score')->nullable();
            $table->enum('status', ['draft', 'final'])->default('final');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('employee_evaluations');
    }
}
