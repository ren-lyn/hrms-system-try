<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        
    Schema::create('leave_requests', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('employee_id');
    $table->string('type');
    $table->date('from');
    $table->date('to');
    $table->string('status')->default('pending'); // pending, approved, rejected
    $table->timestamps();

    $table->foreign('employee_id')->references('id')->on('users')->onDelete('cascade');
});
    }

    public function down(): void
    {
        Schema::dropIfExists('leaves');
    }
};
