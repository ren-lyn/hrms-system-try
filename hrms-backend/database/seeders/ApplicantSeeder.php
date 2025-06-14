<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Applicant;
use Illuminate\Support\Facades\Hash;

use Illuminate\Database\Seeder;

class ApplicantSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $user = User::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'password' => Hash::make('password'),
                'role_id' => 5,
            ]);

            Applicant::create([
                'user_id' => $user->id,
                'full_name' => $user->name,
                'email' => $user->email,
                'contact_number' => fake()->phoneNumber(),
                'resume_path' => fake()->text(200),
            ]);
        }
    }
}
