<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\JobPostingController;
use App\Http\Controllers\Api\ApplicantController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\LeaveController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/job-postings', [JobPostingController::class, 'index']);
    Route::post('/job-postings', [JobPostingController::class, 'store']);
    Route::put('/job-postings/{id}', [JobPostingController::class, 'update']);
    Route::delete('/job-postings/{id}', [JobPostingController::class, 'destroy']);
});

// Route::middleware(['auth:sanctum', 'role:HR Assistant'])->group(function () {
//     Route::put('/employees/{id}', [EmployeeController::class, 'update']);
//     Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
// });

Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
});


Route::get('/employees', [EmployeeController::class, 'index']);
Route::post('/employees', [EmployeeController::class, 'store']);

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::post('/register', [ApplicantController::class, 'register']);

Route::get('/test', function () {
    return response()->json(['message' => 'Laravel API is working']);
});

//Leave Requests

    Route::middleware('auth:sanctum')->group(function () {
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']); // employee
    Route::get('/leave-requests', [LeaveRequestController::class, 'index']); // hr assistant
    Route::put('/leave-requests/{id}/status', [LeaveRequestController::class, 'updateStatus']); // hr assistant
});

// Employee Leave Requests
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/employee/leave-request', [LeaveController::class, 'store']); // employee submits
    Route::get('/hr/leave-requests', [LeaveController::class, 'index']); // hr views all
    Route::put('/hr/leave-requests/{id}/status', [LeaveController::class, 'updateStatus']); // hr updates status
});