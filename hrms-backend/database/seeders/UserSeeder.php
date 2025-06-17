<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\EmployeeProfile;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create the user (HR Assistant, for example)
        $user = User::create([
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'hr@company.com',
            'password' => Hash::make('password123'),
            'role_id' => 1, // Change this to the correct role ID (e.g., HR Assistant)
        ]);

        // Create their employee profile
        $user->employeeProfile()->create([
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'hr@company.com',
            'position' => 'HR Assistant',
            'department' => 'HR',
            'salary' => 30000,
            'contact_number' => '09991234567',
            'address' => 'Cabuyao, Laguna',
        ]);
    }
}
