<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Employee;

class EmployeePolicy
{
	public function viewAny(User $user): bool { return in_array($user->role, ['Admin','HR']); }
	public function view(User $user, Employee $employee): bool { return in_array($user->role, ['Admin','HR']) || $employee->user_id === $user->id; }
	public function create(User $user): bool { return in_array($user->role, ['Admin','HR']); }
	public function update(User $user, Employee $employee): bool { return in_array($user->role, ['Admin','HR']); }
	public function delete(User $user, Employee $employee): bool { return in_array($user->role, ['Admin']); }
	public function report(User $user): bool { return in_array($user->role, ['Admin','HR']); }
}