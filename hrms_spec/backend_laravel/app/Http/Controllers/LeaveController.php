<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\Employee;
use App\Models\LeaveBalance;
use Carbon\Carbon;

class LeaveController extends Controller
{
	public function index(Request $request)
	{
		$employeeId = $request->get('employee_id');
		$query = LeaveRequest::query();
		if ($employeeId) $query->where('employee_id', $employeeId);
		return response()->json($query->orderBy('created_at','desc')->paginate(20));
	}

	public function store(Request $request)
	{
		$employeeId = $request->get('employee_id');
		$type = $request->get('type');
		$start = Carbon::parse($request->get('start_date'));
		$end = Carbon::parse($request->get('end_date'));
		$days = $start->diffInWeekdays($end) + 1;
		$year = (int)$start->format('Y');
		$balance = LeaveBalance::firstOrCreate(['employee_id'=>$employeeId,'year'=>$year]);
		$available = $type === 'vacation' ? $balance->vacation_days : $balance->sick_days;
		if ($available < $days) return response()->json(['error' => 'insufficient balance'], 422);
		$lr = LeaveRequest::create($request->all());
		return response()->json($lr, 201);
	}

	public function approve($id)
	{
		$lr = LeaveRequest::findOrFail($id);
		$lr->status = 'approved';
		$lr->save();
		// TODO: deduct balance and mark attendance as leave
		return response()->json($lr);
	}

	public function reject($id, Request $request)
	{
		$lr = LeaveRequest::findOrFail($id);
		$lr->status = 'rejected';
		$lr->save();
		return response()->json($lr);
	}
}