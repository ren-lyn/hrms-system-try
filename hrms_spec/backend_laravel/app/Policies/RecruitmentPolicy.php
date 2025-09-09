<?php

namespace App\Policies;

use App\Models\User;
use App\Models\JobPost;
use App\Models\Application;

class RecruitmentPolicy
{
	public function managePosts(User $user): bool { return in_array($user->role, ['Admin','HR']); }
	public function apply(User $user): bool { return in_array($user->role, ['Applicant']); }
	public function manageApplications(User $user): bool { return in_array($user->role, ['Admin','HR']); }
}