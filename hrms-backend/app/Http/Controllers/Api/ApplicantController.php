<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Applicant;
use Illuminate\Support\Facades\Hash;

class ApplicantController extends Controller
{
    public function register(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email|unique:applicants,email',
            'password'   => 'required|confirmed|min:6',
            'phone'      => 'nullable|string|max:20',
            'resume'     => 'nullable|string|max:1000',
        ]);

        // Create the user
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role_id'    => 5, // Assuming 5 = Applicant
        ]);

        // Create the applicant profile
        Applicant::create([
            'user_id'        => $user->id,
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'          => $request->email,
            'contact_number' => $request->phone ?? null,
            'resume_path'    => $request->resume ?? null,
        ]);

        return response()->json(['message' => 'Registration successful.'], 201);
    }
}
// This controller handles the registration of applicants, creating both a user and an applicant profile.