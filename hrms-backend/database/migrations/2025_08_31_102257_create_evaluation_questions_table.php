<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('evaluation_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('evaluation_form_id');
            $table->string('category');
            $table->text('question_text');
            $table->text('description')->nullable();
            $table->integer('order')->default(1);
            $table->timestamps();

            $table->foreign('evaluation_form_id')->references('id')->on('evaluation_forms')->onDelete('cascade');
            $table->index(['evaluation_form_id', 'order']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('evaluation_questions');
    }
};