<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\EmployeeProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run()
    {
        $employees = EmployeeProfile::all();

        foreach ($employees as $employee) {
            $startDate = Carbon::now()->subDays(30);
            for ($i = 0; $i < 10; $i++) {
                Attendance::create([
                    'employee_id' => $employee->id,
                    'date' => $startDate->copy()->addDays($i)->format('Y-m-d'),
                    'clock_in' => now()->setTime(rand(8, 9), rand(0, 59))->format('H:i:s'),
                    'clock_out' => now()->setTime(rand(17, 18), rand(0, 59))->format('H:i:s'),
                    'status' => ['Present', 'Absent', 'Late', 'On Leave'][rand(0, 3)],
                ]);
            }
        }
    }
}
