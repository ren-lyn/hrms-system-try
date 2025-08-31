<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('evaluation_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('evaluation_id');
            $table->unsignedBigInteger('evaluation_question_id');
            $table->integer('rating'); // 1-10 rating
            $table->enum('classification', ['Strength', 'Weakness', 'Neutral'])->nullable();
            $table->text('manager_comment')->nullable();
            $table->timestamps();

            $table->foreign('evaluation_id')->references('id')->on('evaluations')->onDelete('cascade');
            $table->foreign('evaluation_question_id')->references('id')->on('evaluation_questions')->onDelete('cascade');
            
            $table->unique(['evaluation_id', 'evaluation_question_id']);
            $table->index(['evaluation_id', 'rating']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluation_responses');
    }
};
