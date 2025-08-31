<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('evaluation_form_id');
            $table->unsignedBigInteger('employee_id');
            $table->unsignedBigInteger('manager_id');
            $table->decimal('total_score', 5, 2)->nullable();
            $table->decimal('average_score', 5, 2)->nullable();
            $table->enum('status', ['Draft', 'Submitted', 'Reviewed'])->default('Draft');
            $table->text('general_comments')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->timestamp('next_evaluation_date')->nullable(); // For 3-month cycle
            $table->timestamps();

            $table->foreign('evaluation_form_id')->references('id')->on('evaluation_forms')->onDelete('cascade');
            $table->foreign('employee_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('manager_id')->references('id')->on('users')->onDelete('cascade');
            
            // Prevent duplicate evaluations for same period
            $table->unique(['evaluation_form_id', 'employee_id', 'manager_id', 'created_at'],
        'eval_form_emp_mgr_created_unique');
            $table->index(['employee_id', 'status']);
            $table->index(['manager_id', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluations');
    }
};