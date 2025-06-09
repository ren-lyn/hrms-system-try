<?php

namespace Database\Seeders;

use App\Models\ResignationFlag;
use App\Models\EmployeeProfile;
use Illuminate\Database\Seeder;

class ResignationFlagSeeder extends Seeder
{
    public function run()
    {
        EmployeeProfile::inRandomOrder()->take(3)->each(function ($employee) {
            ResignationFlag::factory()->create([
                'employee_id' => $employee->id,
                'flag_reason' => 'Frequent absences and low evaluation scores.',
            ]);
        });
    }
}
