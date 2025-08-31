<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobApplication;

class JobApplicationController extends Controller
{
    // Applicant: Apply to a job
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_posting_id' => 'required|exists:job_postings,id',
            'resume' => 'required|file|mimes:pdf|max:2048',
        ]);

        $resumePath = $request->file('resume')->store('resumes', 'public');

        $application = JobApplication::create([
            'job_posting_id' => $validated['job_posting_id'],
            'applicant_id' => $request->user()->id, // or auth()->id()
            'resume_path' => $resumePath,
            'status' => 'pending',
        ]);

        return response()->json($application, 201);
    }

    // HR: View all applications
    public function index()
    {
        return JobApplication::with(['jobPosting', 'applicant'])->latest()->get();
    }
}