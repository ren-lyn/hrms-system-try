<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DisciplinaryAction>
 */
class DisciplinaryActionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'incident_date' => $this->faker->dateTimeBetween('-1 years', 'now')->format('Y-m-d'),
            'violation' => $this->faker->sentence(6),
            'explanation' => $this->faker->optional()->paragraph(),
            'status' => $this->faker->randomElement(['Pending', 'Resolved', 'Rejected']),
        ];
    }
}
