<?php

namespace Database\Seeders;

use App\Models\OnboardingTask;
use App\Models\Application;
use Illuminate\Database\Seeder;

class OnboardingTaskSeeder extends Seeder
{
    public function run()
    {
        Application::where('status', 'Accepted')->each(function ($application) {
            OnboardingTask::factory()->count(3)->create([
                'application_id' => $application->id,
            ]);
        });
    }
}