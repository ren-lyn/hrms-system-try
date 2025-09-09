<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\Employee;
use App\Models\LeaveBalance;
use Carbon\Carbon;
use App\Models\Attendance;

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
		$employeeId = $request->get('employee_id') ?: optional($request->user())->employee->id;
		$type = $request->get('type');
		$start = Carbon::parse($request->get('start_date'));
		$end = Carbon::parse($request->get('end_date'));
		$days = $start->diffInWeekdays($end) + 1;
		$year = (int)$start->format('Y');
		$balance = LeaveBalance::firstOrCreate(['employee_id'=>$employeeId,'year'=>$year]);
		$available = $type === 'vacation' ? $balance->vacation_days : $balance->sick_days;
		if ($available < $days) return response()->json(['error' => 'insufficient balance'], 422);

		// limit: max 3 active requests per month
		$monthStart = $start->copy()->startOfMonth();
		$monthEnd = $start->copy()->endOfMonth();
		$activeCount = LeaveRequest::where('employee_id',$employeeId)
			->whereBetween('start_date', [$monthStart, $monthEnd])
			->whereIn('status', ['pending','approved'])
			->count();
		if ($activeCount >= 3) return response()->json(['error' => 'max_requests_reached'], 422);
		$lr = LeaveRequest::create($request->all());
		return response()->json($lr, 201);
	}

	public function approve($id)
	{
		$lr = LeaveRequest::findOrFail($id);
		$lr->status = 'approved';
		$lr->save();
		// Deduct balance and mark attendance as leave
		$year = (int)Carbon::parse($lr->start_date)->format('Y');
		$balance = LeaveBalance::firstOrCreate(['employee_id'=>$lr->employee_id,'year'=>$year]);
		$days = Carbon::parse($lr->start_date)->diffInWeekdays(Carbon::parse($lr->end_date)) + 1;
		if ($lr->type === 'vacation') $balance->vacation_days = max(0, $balance->vacation_days - $days);
		else $balance->sick_days = max(0, $balance->sick_days - $days);
		$balance->save();
		// Mark attendance records as leave
		$period = new \DatePeriod(new \DateTime($lr->start_date), new \DateInterval('P1D'), (new \DateTime($lr->end_date))->modify('+1 day'));
		foreach ($period as $d) {
			Attendance::updateOrCreate([
				'employee_id' => $lr->employee_id,
				'date' => $d->format('Y-m-d'),
			], [ 'status' => 'leave' ]);
		}
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