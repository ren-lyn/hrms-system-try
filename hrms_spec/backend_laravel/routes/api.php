<?php

use Illuminate\Support\Facades\Route;

// Auth
Route::post('/auth/login', [App\Http\Controllers\AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
	Route::get('/auth/me', [App\Http\Controllers\AuthController::class, 'me']);

	// Employees (HR/Admin)
	Route::get('/employees', [App\Http\Controllers\EmployeeController::class, 'index']);
	Route::post('/employees', [App\Http\Controllers\EmployeeController::class, 'store']);
	Route::get('/employees/{id}', [App\Http\Controllers\EmployeeController::class, 'show']);
	Route::patch('/employees/{id}', [App\Http\Controllers\EmployeeController::class, 'update']);
	Route::delete('/employees/{id}', [App\Http\Controllers\EmployeeController::class, 'destroy']);
	Route::get('/employees/report', [App\Http\Controllers\EmployeeController::class, 'report']);

	// Employee self-service
	Route::get('/me/employee', [App\Http\Controllers\EmployeeController::class, 'me']);
	Route::patch('/me/employee', [App\Http\Controllers\EmployeeController::class, 'updateMe']);

	// Attendance
	Route::post('/attendance/logs', [App\Http\Controllers\AttendanceController::class, 'ingest']);
	Route::get('/attendance/workdays', [App\Http\Controllers\AttendanceController::class, 'workdays']);

	// Leave
	Route::get('/leaves/requests', [App\Http\Controllers\LeaveController::class, 'index']);
	Route::post('/leaves/requests', [App\Http\Controllers\LeaveController::class, 'store']);
	Route::patch('/leaves/requests/{id}/approve', [App\Http\Controllers\LeaveController::class, 'approve']);
	Route::patch('/leaves/requests/{id}/reject', [App\Http\Controllers\LeaveController::class, 'reject']);

	// Payroll
	Route::post('/payroll/runs', [App\Http\Controllers\PayrollController::class, 'createRun']);
	Route::post('/payroll/runs/{id}/process', [App\Http\Controllers\PayrollController::class, 'processRun']);
	Route::get('/payroll/summary', [App\Http\Controllers\PayrollController::class, 'summary']);
	Route::get('/payroll/runs/{id}/items', [App\Http\Controllers\PayrollController::class, 'items']);

	// Performance
	Route::post('/performance/reviews', [App\Http\Controllers\PerformanceController::class, 'store']);
	Route::get('/performance/reviews', [App\Http\Controllers\PerformanceController::class, 'index']);
	Route::get('/performance/summary', [App\Http\Controllers\PerformanceController::class, 'summary']);

	// Recruitment & Job Posts
	Route::get('/recruitment/job-posts', [App\Http\Controllers\RecruitmentController::class, 'listJobPosts']);
	Route::post('/recruitment/job-posts', [App\Http\Controllers\RecruitmentController::class, 'createJobPost']);
	Route::patch('/recruitment/job-posts/{id}/publish', [App\Http\Controllers\RecruitmentController::class, 'publishJobPost']);
	Route::patch('/recruitment/job-posts/{id}/close', [App\Http\Controllers\RecruitmentController::class, 'closeJobPost']);

	// Applications
	Route::get('/recruitment/applications', [App\Http\Controllers\RecruitmentController::class, 'listApplications']);
	Route::post('/recruitment/applications', [App\Http\Controllers\RecruitmentController::class, 'submitApplication']);
	Route::patch('/recruitment/applications/{id}/status', [App\Http\Controllers\RecruitmentController::class, 'updateApplicationStatus']);

	// Onboarding
	Route::post('/onboarding/assignments', [App\Http\Controllers\OnboardingController::class, 'assign']);
	Route::patch('/onboarding/assignments/{id}', [App\Http\Controllers\OnboardingController::class, 'update']);

	// Benefits
	Route::post('/benefits/enrollments', [App\Http\Controllers\BenefitController::class, 'enroll']);
	Route::get('/benefits/claims', [App\Http\Controllers\BenefitController::class, 'indexClaims']);
	Route::post('/benefits/claims', [App\Http\Controllers\BenefitController::class, 'storeClaim']);
	Route::patch('/benefits/claims/{id}/approve', [App\Http\Controllers\BenefitController::class, 'approveClaim']);
	Route::patch('/benefits/claims/{id}/reject', [App\Http\Controllers\BenefitController::class, 'rejectClaim']);
	Route::delete('/benefits/enrollments/{id}', [App\Http\Controllers\BenefitController::class, 'terminateEnrollment']);

	// Disciplinary
	Route::get('/disciplinary/actions', [App\Http\Controllers\DisciplinaryController::class, 'index']);
	Route::post('/disciplinary/actions', [App\Http\Controllers\DisciplinaryController::class, 'store']);

	// Reports
	Route::post('/reports/export', [App\Http\Controllers\ReportController::class, 'export']);

	// Analytics
	Route::get('/analytics/turnover-risk', [App\Http\Controllers\AnalyticsController::class, 'turnoverRisk']);
});