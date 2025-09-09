<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobPost;
use App\Models\Application;
use App\Models\Employee;
use App\Models\ApplicationDocument;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\JobPostStoreRequest;
use App\Http\Requests\JobPostUpdateRequest;
use App\Http\Requests\ApplicationStoreRequest;

class RecruitmentController extends Controller
{
	public function listJobPosts(Request $request)
	{
		$status = $request->get('status');
		$q = $request->get('q');
		$query = JobPost::query();
		if ($status) $query->where('status', $status);
		if ($q) $query->where(function($sub) use ($q){ $sub->where('title','like',"%$q%")->orWhere('description','like',"%$q%")->orWhere('requirements','like',"%$q%"); });
		return response()->json($query->orderBy('created_at','desc')->paginate(20));
	}

	public function createJobPost(JobPostStoreRequest $request)
	{
		$post = JobPost::create($request->validated() + ['status' => $request->get('status','draft')]);
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

	public function updateJobPost(JobPostUpdateRequest $request, $id)
	{
		$post = JobPost::findOrFail($id);
		$post->fill($request->validated());
		$post->save();
		return response()->json($post);
	}

	public function deleteJobPost($id)
	{
		$post = JobPost::findOrFail($id);
		$post->delete();
		return response()->json(['deleted'=>true]);
	}

	public function submitApplication(ApplicationStoreRequest $request)
	{
		$app = Application::create($request->validated() + ['applicant_user_id' => optional($request->user())->id]);
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

	public function offerResponse($id, Request $request)
	{
		$app = Application::findOrFail($id);
		$app->offer_response = $request->get('response'); // accepted|declined
		if ($request->get('response') === 'accepted' && $request->get('contract_date')) {
			$app->contract_date = $request->get('contract_date');
		}
		$app->save();
		return response()->json($app);
	}

	public function myApplications(Request $request)
	{
		$user = $request->user();
		return response()->json(Application::with('job')->where('applicant_user_id',$user->id)->orderByDesc('id')->paginate(50));
	}

	public function uploadDocument(Request $request, $id)
	{
		// expects doc_type and storage_url (pre-uploaded or via file service)
		$app = Application::findOrFail($id);
		$doc = ApplicationDocument::create($request->only(['doc_type','storage_url']) + [ 'application_id' => $app->id ]);
		return response()->json($doc, 201);
	}

	public function hire(Request $request, $id)
	{
		// Convert application -> employee profile creation (basic)
		$app = Application::with('job')->findOrFail($id);
		DB::transaction(function() use ($app) {
			$employee = Employee::create([
				'user_id' => $app->applicant_user_id,
				'employee_no' => null,
				'hire_date' => now()->toDateString(),
			]);
		});
		$app->status = 'hired';
		$app->save();
		return response()->json($app);
	}

	public function report(Request $request)
	{
		$from = $request->get('from');
		$to = $request->get('to');
		$q = Application::join('job_posts','job_posts.id','=','applications.job_id')
			->selectRaw('applications.status, count(*) as count')
			->groupBy('applications.status');
		return response()->json(['totals' => $q->get()]);
	}
}