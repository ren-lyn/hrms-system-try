<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LeaveRequest>
 */
class LeaveRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['Sick Leave', 'Vacation Leave', 'Maternity Leave']),
            'start_date' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'end_date' => $this->faker->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'status' => 'Pending',
            'reason' => $this->faker->sentence(),
        ];
    }
}
