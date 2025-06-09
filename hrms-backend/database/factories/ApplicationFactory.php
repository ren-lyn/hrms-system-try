<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Application;
use App\Models\JobPosting;
use App\Models\Applicant;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'job_posting_id' => JobPosting::inRandomOrder()->first()?->id ?? JobPosting::factory(),
            'applicant_id' => Applicant::inRandomOrder()->first()?->id ?? Applicant::factory(),
            'status' => $this->faker->randomElement(['Applied', 'Interview', 'Hired', 'Rejected']),
            'resume_path' => 'resumes/' . $this->faker->uuid . '.pdf',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
