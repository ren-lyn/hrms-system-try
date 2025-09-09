<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PayrollRun;
use App\Models\PayrollItem;
use Carbon\Carbon;

class PayrollController extends Controller
{
	public function createRun(Request $request)
	{
		$run = PayrollRun::create($request->only(['period_start','period_end','status','created_by']));
		return response()->json($run, 201);
	}

	public function processRun($id)
	{
		// TODO: queue background job to compute payroll items
		$run = PayrollRun::findOrFail($id);
		$run->status = 'processing';
		$run->save();
		return response()->json(['status' => 'enqueued']);
	}

	public function items($id)
	{
		$items = PayrollItem::where('payroll_run_id', $id)->with('employee')->paginate(100);
		return response()->json($items);
	}

	public function summary(Request $request)
	{
		$from = Carbon::parse($request->get('from', now()->startOfMonth()))->toDateString();
		$to = Carbon::parse($request->get('to', now()->endOfMonth()))->toDateString();
		$series = PayrollItem::join('payroll_runs','payroll_runs.id','=','payroll_items.payroll_run_id')
			->whereBetween('payroll_runs.period_start', [$from, $to])
			->selectRaw('payroll_runs.period_start as date, sum(gross_pay) as gross, sum(net_pay) as net, sum(tax) as tax, sum(deductions_total) as deductions')
			->groupBy('payroll_runs.period_start')
			->orderBy('date')
			->get();
		return response()->json([ 'period' => [ 'from' => $from, 'to' => $to ], 'series' => $series ]);
	}
}