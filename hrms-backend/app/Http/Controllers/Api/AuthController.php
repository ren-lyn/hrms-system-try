<?php
// hrms-backend/app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            "access_token" => $token,
            "user" => [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "role" => [
                    "id" => $user->role_id ?? null,
                    "name" => $user->role->name ?? null
                ]
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
// This controller handles user authentication, allowing users to log in and log out.
// The login method checks the user's credentials and returns an access token if valid.