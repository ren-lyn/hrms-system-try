<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReportController extends Controller
{
	public function export(Request $request)
	{
		// TODO: dispatch job to create report and return job id
		return response()->json(['id' => uniqid('report_'), 'status' => 'enqueued'], 202);
	}
}