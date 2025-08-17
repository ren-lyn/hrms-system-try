<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEvaluationsTable extends Migration
{
    public function up()
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Employee being evaluated
            $table->foreignId('evaluator_id')->constrained('users')->onDelete('cascade'); // Evaluator (e.g., HR Assistant)

            $table->tinyInteger('punctuality')->unsigned();
            $table->tinyInteger('attitude')->unsigned();
            $table->tinyInteger('quality_of_work')->unsigned();
            $table->tinyInteger('initiative')->unsigned();
            $table->tinyInteger('teamwork')->unsigned();
            $table->tinyInteger('trustworthiness')->unsigned();

            $table->integer('total_score');
            $table->enum('status', ['Draft', 'Final'])->default('Draft');

            $table->json('remarks')->nullable(); // ✅ Store as JSON
            $table->text('comments')->nullable(); // ✅ Optional final comment field from frontend
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluations');
    }
}
