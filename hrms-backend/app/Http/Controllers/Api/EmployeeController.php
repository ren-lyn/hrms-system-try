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
            ->where('role_id', '!=', 5) // Exclude Applicants
            ->whereHas('employeeProfile') // Must have an employee profile
            ->get();

        return response()->json($employees);
    }



    // POST /employees
    public function store(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|string',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'required|email|unique:employee_profiles,email',
            'position' => 'required|string',
            'role_id' => 'required|integer|exists:roles,id',
            'department' => 'nullable|string',
            'salary' => 'nullable|numeric',
            'contact_number' => 'nullable|string',
            'address' => 'nullable|string'
        ]);


        $roleId = $validated['role_id'];


        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $roleId,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
        ]);


        $user->employeeProfile()->create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'position' => $validated['position'],
            'department' => $validated['department'] ?? null,
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
        'password' => 'nullable|string',
        'first_name' => 'sometimes|string',
        'last_name' => 'sometimes|string',
        'email' => 'sometimes|email|unique:employee_profiles,email,' . $user->employeeProfile->id,
        'position' => 'sometimes|string',
        'role_id' => 'sometimes|integer|exists:roles,id',
        'department' => 'nullable|string',
        'salary' => 'nullable|numeric',
        'contact_number' => 'nullable|string',
        'address' => 'nullable|string',
    ]);

    if (isset($validated['password'])) {
        $user->update(['password' => Hash::make($validated['password'])]);
    }

    if (isset($validated['role_id'])) {
        $user->update(['role_id' => $validated['role_id']]);
    }

    // Update other fields on the user
    $user->update([
        'first_name' => $validated['first_name'] ?? $user->first_name,
        'last_name' => $validated['last_name'] ?? $user->last_name,
        'email' => $validated['email'] ?? $user->email,
    ]);

    // Update employee profile
    $user->employeeProfile->update([
        'first_name' => $validated['first_name'] ?? $user->employeeProfile->first_name,
        'last_name' => $validated['last_name'] ?? $user->employeeProfile->last_name,
        'email' => $validated['email'] ?? $user->employeeProfile->email,
        'position' => $validated['position'] ?? $user->employeeProfile->position,
        'department' => $validated['department'] ?? $user->employeeProfile->department,
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
