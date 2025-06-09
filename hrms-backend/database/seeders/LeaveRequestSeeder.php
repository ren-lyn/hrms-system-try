<?php

namespace Database\Seeders;

use App\Models\LeaveRequest;
use App\Models\EmployeeProfile;
use Illuminate\Database\Seeder;

class LeaveRequestSeeder extends Seeder
{
    public function run()
    {
        $employees = EmployeeProfile::all();

        foreach ($employees as $employee) {
            LeaveRequest::factory()->count(2)->create([
                'employee_id' => $employee->id,
            ]);
        }
    }
}