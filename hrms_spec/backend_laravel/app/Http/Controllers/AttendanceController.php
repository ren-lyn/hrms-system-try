<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Employee;
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

	public function meList(Request $request)
	{
		$user = $request->user();
		$employee = Employee::where('user_id', $user->id)->firstOrFail();
		$from = $request->get('from');
		$to = $request->get('to');
		$q = Attendance::where('employee_id', $employee->id)->orderByDesc('date');
		if ($from) $q->where('date', '>=', $from);
		if ($to) $q->where('date', '<=', $to);
		return response()->json($q->paginate(30));
	}

	public function clock(Request $request)
	{
		$user = $request->user();
		$employee = Employee::where('user_id', $user->id)->firstOrFail();
		$now = Carbon::now();
		$date = $now->toDateString();
		$record = Attendance::firstOrNew(['employee_id' => $employee->id, 'date' => $date]);
		if (!$record->exists) {
			$record->time_in = $now;
			$record->status = 'present';
		} else {
			if (empty($record->time_out)) {
				$record->time_out = $now;
			} else {
				$record->time_out = $now; // replace previous time_out with current
			}
		}
		$record->source = 'manual';
		$record->save();
		return response()->json(['status' => 'ok', 'id' => $record->id, 'time_in' => $record->time_in, 'time_out' => $record->time_out]);
	}

	public function listAll(Request $request)
	{
		$this->requireRole($request, ['Admin','HR']);
		$employeeId = $request->get('employeeId');
		$from = $request->get('from');
		$to = $request->get('to');
		$q = Attendance::with('employee')->orderByDesc('date');
		if ($employeeId) $q->where('employee_id', $employeeId);
		if ($from) $q->where('date', '>=', $from);
		if ($to) $q->where('date', '<=', $to);
		return response()->json($q->paginate(100));
	}

	public function updateEntry(Request $request, $id)
	{
		$this->requireRole($request, ['Admin','HR']);
		$att = Attendance::findOrFail($id);
		$att->fill($request->only(['time_in','time_out','status']));
		$att->save();
		return response()->json($att);
	}

	public function report(Request $request)
	{
		$this->requireRole($request, ['Admin','HR']);
		$from = Carbon::parse($request->get('from', now()->startOfMonth()))->toDateString();
		$to = Carbon::parse($request->get('to', now()->endOfMonth()))->toDateString();
		$employeeId = $request->get('employeeId');
		$q = Attendance::with('employee.user')->whereBetween('date', [$from,$to])->orderBy('date');
		if ($employeeId) $q->where('employee_id', $employeeId);
		$headers = [
			'Content-Type' => 'text/csv',
			'Content-Disposition' => 'attachment; filename="attendance.csv"',
		];
		$callback = function() use ($q) {
			$out = fopen('php://output', 'w');
			fputcsv($out, ['Date','Employee','Time In','Time Out','Status']);
			$q->chunk(1000, function($rows) use ($out) {
				foreach ($rows as $r) {
					fputcsv($out, [
						$r->date,
						optional(optional($r->employee)->user)->name,
						$r->time_in,
						$r->time_out,
						$r->status,
					]);
				}
			});
			fclose($out);
		};
		return response()->stream($callback, 200, $headers);
	}

	private function requireRole(Request $request, array $roles)
	{
		$user = $request->user();
		if (!$user || !in_array($user->role, $roles)) {
			abort(403, 'Forbidden');
		}
	}
}