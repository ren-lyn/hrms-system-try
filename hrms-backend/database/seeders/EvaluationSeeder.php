<?php

namespace Database\Seeders;

use App\Models\Evaluation;
use App\Models\EmployeeProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class EvaluationSeeder extends Seeder
{
    public function run()
    {
        $managerIds = User::whereHas('role', fn($q) => $q->where('name', 'Manager'))->pluck('id');

        EmployeeProfile::all()->each(function ($employee) use ($managerIds) {
            Evaluation::factory()->create([
                'employee_id' => $employee->id,
                'manager_id' => $managerIds->random(),
            ]);
        });
    }
}