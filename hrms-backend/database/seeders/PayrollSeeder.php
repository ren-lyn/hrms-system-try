<?php

namespace Database\Seeders;

use App\Models\EmployeeProfile;
use App\Models\Payroll;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PayrollSeeder extends Seeder
{
    public function run()
    {
        $employees = EmployeeProfile::all();
        $now = Carbon::now();

        foreach ($employees as $employee) {
            $periodStart = $now->copy()->startOfMonth()->toDateString();
            $periodEnd = $now->copy()->endOfMonth()->toDateString();

            $gross = 20000;
            $deductions = 2000;
            $netPay = $gross - $deductions;

            Payroll::create([
                'employee_id' => $employee->id,
                'period_start' => $periodStart,
                'period_end' => $periodEnd,
                'gross' => $gross,
                'deductions' => $deductions,
                'net_pay' => $netPay,
            ]);
        }
    }
}
