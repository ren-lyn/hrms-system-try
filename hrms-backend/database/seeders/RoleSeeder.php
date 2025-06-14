<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Role::insert([
            ['name' => 'HR Assistant'],
            ['name' => 'HR Staff'],
            ['name' => 'Manager'],
            ['name' => 'Employee'],
            ['name' => 'Applicant'],
        ]);
    }
}
