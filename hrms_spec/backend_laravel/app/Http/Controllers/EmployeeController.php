<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Http\Requests\EmployeeStoreRequest;
use App\Http\Requests\EmployeeUpdateRequest;

class EmployeeController extends Controller
{
	private function requireRole(Request $request, array $roles)
	{
		$user = $request->user();
		if (!$user || !in_array($user->role, $roles)) {
			abort(403, 'Forbidden');
		}
	}

	public function index(Request $request)
	{
		$this->requireRole($request, ['Admin','HR']);
		$q = $request->get('q');
		$status = $request->get('status');
		$query = Employee::with(['user','department','position']);
		if ($q) {
			$query->where(function($sub) use ($q) {
				$sub->where('employee_no','like',"%$q%")
					->orWhere('nickname','like',"%$q%")
					->orWhere('contact_no','like',"%$q%")
					->orWhereHas('user', function($u) use ($q){ $u->where('name','like',"%$q%"); });
			});
		}
		if ($status === 'active') {
			$query->whereNull('termination_date')->whereNotIn('employment_status', ['Retired','Resigned']);
		} elseif ($status === 'inactive') {
			$query->whereNotNull('termination_date')->orWhereIn('employment_status', ['Retired','Resigned']);
		}
		return response()->json($query->paginate(20));
	}

	public function store(EmployeeStoreRequest $request)
	{
		$this->requireRole($request, ['Admin','HR']);
		$employee = Employee::create($request->validated());
		return response()->json($employee, 201);
	}

	public function show(Request $request, $id)
	{
		$employee = Employee::with(['user','department','position'])->findOrFail($id);
		// HR/Admin can view; managers/employees should use /me endpoint
		$this->requireRole($request, ['Admin','HR']);
		return response()->json($employee);
	}

	public function update(EmployeeUpdateRequest $request, $id)
	{
		$this->requireRole($request, ['Admin','HR']);
		$employee = Employee::findOrFail($id);
		$employee->fill($request->validated());
		$employee->save();
		return response()->json($employee);
	}

	public function destroy(Request $request, $id)
	{
		$this->requireRole($request, ['Admin','HR']);
		$employee = Employee::findOrFail($id);
		$employee->delete();
		return response()->json(['deleted' => true]);
	}

	public function me(Request $request)
	{
		$user = $request->user();
		if (!$user) abort(401);
		$employee = Employee::with(['user','department','position'])->where('user_id', $user->id)->firstOrFail();
		return response()->json($employee);
	}

	public function updateMe(Request $request)
	{
		$user = $request->user();
		if (!$user) abort(401);
		$employee = Employee::where('user_id', $user->id)->firstOrFail();
		$allowed = $request->only(['contact_no','present_address','nickname']);
		$employee->fill($allowed);
		$employee->save();
		return response()->json($employee);
	}

	public function report(Request $request)
	{
		$this->requireRole($request, ['Admin','HR']);
		$format = $request->get('format', 'csv');
		$query = Employee::with(['user','department','position']);
		if ($format === 'csv') {
			$headers = [
				'Content-Type' => 'text/csv',
				'Content-Disposition' => 'attachment; filename="employees.csv"',
			];
			$callback = function() use ($query) {
				$out = fopen('php://output', 'w');
				fputcsv($out, ['Employee No','Name','Department','Position','Contact','Status','Hire Date','Termination Date']);
				$query->chunk(500, function($rows) use ($out) {
					foreach ($rows as $e) {
						fputcsv($out, [
							$e->employee_no,
							optional($e->user)->name,
							optional($e->department)->name,
							optional($e->position)->name,
							$e->contact_no,
							$e->employment_status,
							$e->hire_date,
							$e->termination_date,
						]);
					}
				});
				fclose($out);
			};
			return response()->stream($callback, 200, $headers);
		}
		return response()->json($query->paginate(100));
	}
}