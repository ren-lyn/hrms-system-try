<?php
// hrms-backend/app/Http/Controllers/Api/EmployeeController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EmployeeProfile;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    // GET /employees
    public function index()
    {
        $employees = User::with('employeeProfile', 'role')
            ->whereHas('role', fn ($q) => $q->where('name', 'Employee'))
            ->get();

        return response()->json($employees);
    }

    // POST /employees
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string',

            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'position' => 'required|string',
            'department' => 'nullable|string',
            'date_hired' => 'nullable|date',
            'salary' => 'nullable|numeric',
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $employeeRole = Role::where('name', 'Employee')->firstOrFail();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $employeeRole->id,
        ]);

        $user->employeeProfile()->create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'position' => $validated['position'],
            'department' => $validated['department'] ?? null,
            'date_hired' => $validated['date_hired'] ?? null,
            'salary' => $validated['salary'] ?? null,
            'contact_number' => $validated['contact_number'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        return response()->json(['message' => 'Employee created successfully'], 201);
    }

    // PUT /employees/{id}
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string',

            'first_name' => 'sometimes|string',
            'last_name' => 'sometimes|string',
            'position' => 'sometimes|string',
            'department' => 'nullable|string',
            'date_hired' => 'nullable|date',
            'salary' => 'nullable|numeric',
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $user->update([
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'password' => isset($validated['password']) ? Hash::make($validated['password']) : $user->password,
        ]);

        $user->employeeProfile()->update([
            'first_name' => $validated['first_name'] ?? $user->employeeProfile->first_name,
            'last_name' => $validated['last_name'] ?? $user->employeeProfile->last_name,
            'position' => $validated['position'] ?? $user->employeeProfile->position,
            'department' => $validated['department'] ?? $user->employeeProfile->department,
            'date_hired' => $validated['date_hired'] ?? $user->employeeProfile->date_hired,
            'salary' => $validated['salary'] ?? $user->employeeProfile->salary,
            'contact_number' => $validated['contact_number'] ?? $user->employeeProfile->contact_number,
            'address' => $validated['address'] ?? $user->employeeProfile->address,
        ]);

        return response()->json(['message' => 'Employee updated successfully']);
    }

    // DELETE /employees/{id}
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Employee deleted successfully']);
    }
}
