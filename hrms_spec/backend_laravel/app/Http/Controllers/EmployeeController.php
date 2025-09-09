<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;

class EmployeeController extends Controller
{
	public function index(Request $request)
	{
		$q = $request->get('q');
		$query = Employee::with(['user','department','position']);
		if ($q) {
			$query->where(function($sub) use ($q) {
				$sub->where('employee_no','like',"%$q%")
					->orWhere('nickname','like',"%$q%");
			});
		}
		return response()->json($query->paginate(20));
	}

	public function store(Request $request)
	{
		// TODO: validate and create user + employee
		$employee = Employee::create($request->all());
		return response()->json($employee, 201);
	}

	public function show($id)
	{
		$employee = Employee::with(['user','department','position'])->findOrFail($id);
		return response()->json($employee);
	}

	public function update(Request $request, $id)
	{
		$employee = Employee::findOrFail($id);
		// TODO: enforce name change limits and field-level permissions
		$employee->fill($request->all());
		$employee->save();
		return response()->json($employee);
	}
}