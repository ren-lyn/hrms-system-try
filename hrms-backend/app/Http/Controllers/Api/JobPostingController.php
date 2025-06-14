<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    public function index()
    {
        return JobPosting::with('applications')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'status' => 'required|in:Open,Closed',
        ]);

        return JobPosting::create([
            'hr_staff_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'requirements' => $request->requirements,
            'status' => $request->status,
        ]);
    }

    public function update(Request $request, $id)
    {
        $job = JobPosting::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'status' => 'required|in:Open,Closed',
        ]);

        $job->update($request->all());

        return response()->json(['message' => 'Updated successfully.']);
    }

    public function destroy($id)
    {
        JobPosting::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted successfully.']);
    }
}
