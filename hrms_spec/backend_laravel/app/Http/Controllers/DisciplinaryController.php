<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DisciplinaryAction;

class DisciplinaryController extends Controller
{
	public function index(Request $request)
	{
		return response()->json(DisciplinaryAction::orderBy('created_at','desc')->paginate(50));
	}

	public function store(Request $request)
	{
		$action = DisciplinaryAction::create($request->only(['employee_id','category','violation','explanation','decision','investigator_employee_id']));
		return response()->json($action, 201);
	}
}