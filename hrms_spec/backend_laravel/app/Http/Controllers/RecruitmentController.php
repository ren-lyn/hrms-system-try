<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobPost;
use App\Models\Application;

class RecruitmentController extends Controller
{
	public function listJobPosts(Request $request)
	{
		$status = $request->get('status');
		$query = JobPost::query();
		if ($status) $query->where('status', $status);
		return response()->json($query->orderBy('created_at','desc')->paginate(20));
	}

	public function createJobPost(Request $request)
	{
		$post = JobPost::create($request->only(['title','description','requirements','status','created_by']));
		return response()->json($post, 201);
	}

	public function publishJobPost($id)
	{
		$post = JobPost::findOrFail($id);
		$post->status = 'open';
		$post->save();
		return response()->json($post);
	}

	public function closeJobPost($id)
	{
		$post = JobPost::findOrFail($id);
		$post->status = 'closed';
		$post->save();
		return response()->json($post);
	}

	public function submitApplication(Request $request)
	{
		$app = Application::create($request->only(['job_id','applicant_user_id','status','interview_date','resume_url','other_docs_url']));
		return response()->json($app, 201);
	}

	public function listApplications(Request $request)
	{
		return response()->json(Application::with('job')->orderBy('created_at','desc')->paginate(50));
	}

	public function updateApplicationStatus($id, Request $request)
	{
		$app = Application::findOrFail($id);
		$app->status = $request->get('status');
		if ($request->has('interview_date')) $app->interview_date = $request->get('interview_date');
		$app->save();
		return response()->json($app);
	}
}