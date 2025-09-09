<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Attendance;

class AttendancePolicy
{
	public function viewAny(User $user): bool { return in_array($user->role, ['Admin','HR']); }
	public function update(User $user, Attendance $attendance): bool { return in_array($user->role, ['Admin','HR']); }
	public function report(User $user): bool { return in_array($user->role, ['Admin','HR']); }
}