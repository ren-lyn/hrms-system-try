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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|unique:applicants,email',
            'password' => 'required|confirmed|min:6',
            'phone' => 'nullable|string|max:20',
            'resume' => 'nullable|string|max:1000',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role_id'  => 5, // Assuming 4 is for 'Applicant'
        ]);

        Applicant::create([
            'user_id'        => $user->id,
            'full_name'      => $request->name,
            'email'         => $request->email,
            'contact_number' => $request->phone ?? null,
            'resume_path'    => $request->resume ?? null,
        ]);

        return response()->json(['message' => 'Registration successful.'], 201);
    }
}

