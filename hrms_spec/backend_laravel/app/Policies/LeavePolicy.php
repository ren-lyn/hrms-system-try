<?php

namespace App\Policies;

use App\Models\User;
use App\Models\LeaveRequest;

class LeavePolicy
{
	public function approve(User $user, LeaveRequest $leave): bool { return in_array($user->role, ['Admin','HR']); }
	public function submit(User $user): bool { return in_array($user->role, ['Employee']); }
}