<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaveRequestController extends Controller
{
    // EMPLOYEE: File leave request
    public function store(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'type' => 'required|string',
                'from' => 'required|date',
                'to' => 'required|date|after_or_equal:from',
            ]);

            // TEMP: Set a fixed employee_id for testing
            $validated['employee_id'] = 1; // Replace with Auth::id() once login works

            // Create leave request
            $leave = LeaveRequest::create($validated);

            // Return success + data
            return response()->json([
                'message' => 'Leave request submitted successfully.',
                'data' => $leave
            ]);
        } catch (\Exception $e) {
            // Catch any error (validation or DB)
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    // HR ASSISTANT: View all leave requests
    public function index()
    {
        return LeaveRequest::with('employee')->latest()->get();
    }

    // HR ASSISTANT: Approve or Reject
    public function updateStatus($id, Request $request)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $leave = LeaveRequest::findOrFail($id);
        $leave->status = $request->status;
        $leave->save();

        return response()->json(['message' => 'Leave request updated successfully.']);
    }
}
