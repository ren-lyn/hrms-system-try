<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OnboardingTask;

class OnboardingController extends Controller
{
	public function assign(Request $request)
	{
		$task = OnboardingTask::create($request->only(['employee_id','task','status','due_date','document_url']));
		return response()->json($task, 201);
	}

	public function update($id, Request $request)
	{
		$task = OnboardingTask::findOrFail($id);
		$task->fill($request->only(['status','document_url','due_date']));
		$task->save();
		return response()->json($task);
	}
}