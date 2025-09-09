<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OnboardingTask;
use App\Models\OnboardingSession;
use App\Models\Employee;

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

	public function myTasks(Request $request)
	{
		$user = $request->user();
		$employee = Employee::where('user_id',$user->id)->firstOrFail();
		$tasks = OnboardingTask::where('employee_id',$employee->id)->orderBy('status')->get();
		$sessions = OnboardingSession::where('employee_id',$employee->id)->orderBy('scheduled_at')->get();
		return response()->json(['tasks'=>$tasks,'sessions'=>$sessions]);
	}

	public function scheduleSession(Request $request)
	{
		$session = OnboardingSession::create($request->only(['employee_id','title','description','scheduled_at','location','status']));
		return response()->json($session, 201);
	}

	public function checklistReport(Request $request)
	{
		$employeeId = $request->get('employee_id');
		$tasks = OnboardingTask::where('employee_id',$employeeId)->get();
		$completed = $tasks->where('status','completed')->count();
		$total = $tasks->count();
		return response()->json(['employee_id'=>$employeeId,'completed'=>$completed,'total'=>$total]);
	}
}