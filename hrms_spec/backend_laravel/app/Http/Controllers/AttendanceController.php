<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceController extends Controller
{
	public function ingest(Request $request)
	{
		$employeeId = $request->get('employee_id');
		$timestamp = Carbon::parse($request->get('timestamp', now()));
		$date = $timestamp->toDateString();
		$record = Attendance::firstOrNew(['employee_id' => $employeeId, 'date' => $date]);
		if (!$record->exists) {
			$record->time_in = $timestamp;
			$record->status = 'present';
		} else {
			// if no time_out yet, set; otherwise replace with latest
			$record->time_out = $timestamp;
		}
		$record->source = $request->get('source', 'biometric');
		$record->save();
		return response()->json(['status' => 'ok', 'id' => $record->id], 202);
	}

	public function workdays(Request $request)
	{
		$from = Carbon::parse($request->get('from', now()->startOfMonth()))->toDateString();
		$to = Carbon::parse($request->get('to', now()->endOfMonth()))->toDateString();
		$data = Attendance::whereBetween('date', [$from, $to])
			->selectRaw('date, sum(case when status = "present" then 1 else 0 end) as present, sum(case when status = "absent" then 1 else 0 end) as absent')
			->groupBy('date')
			->orderBy('date')
			->get();
		return response()->json(['heatmap' => $data]);
	}
}