<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
	protected $policies = [
		\App\Models\Employee::class => \App\Policies\EmployeePolicy::class,
		\App\Models\Attendance::class => \App\Policies\AttendancePolicy::class,
		\App\Models\LeaveRequest::class => \App\Policies\LeavePolicy::class,
		\App\Models\JobPost::class => \App\Policies\RecruitmentPolicy::class,
		\App\Models\Application::class => \App\Policies\RecruitmentPolicy::class,
	];

	public function boot(): void
	{
		$this->registerPolicies();
	}
}