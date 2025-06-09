<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Evaluation>
 */
class EvaluationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'evaluation_date' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'score' => $this->faker->numberBetween(1, 100),
            'remarks' => $this->faker->optional()->sentence(),
        ];
    }
}
