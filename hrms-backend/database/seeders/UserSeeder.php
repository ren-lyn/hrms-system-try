<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a role if it doesn't exist
        $hrStaffRole = Role::firstOrCreate(['name' => 'HR Staff']);

        // Create one HR Staff user
        User::factory()->create([
            'name' => 'HR Staff User',
            'email' => 'hrstaff@example.com',
            'role_id' => $hrStaffRole->id,
        ]);

        // Create 9 more random users
        User::factory(9)->create();
    }
}
