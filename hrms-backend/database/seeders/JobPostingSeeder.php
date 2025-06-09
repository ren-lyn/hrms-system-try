<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\JobPosting;

class JobPostingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    $hrStaff = User::whereHas('role', function ($q) {
        $q->where('name', 'HR Staff');
    })->inRandomOrder()->first();

    JobPosting::factory()->count(5)->create([
        'hr_staff_id' => $hrStaff->id,
    ]);
}

}
