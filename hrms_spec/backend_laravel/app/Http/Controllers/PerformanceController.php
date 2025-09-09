<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evaluation;
use App\Models\EvaluationItem;
use Carbon\Carbon;

class PerformanceController extends Controller
{
	public function index(Request $request)
	{
		$employeeId = $request->get('employee_id');
		$query = Evaluation::with('items');
		if ($employeeId) $query->where('employee_id', $employeeId);
		return response()->json($query->orderBy('created_at','desc')->paginate(50));
	}

	public function store(Request $request)
	{
		$evaluation = Evaluation::create($request->only(['employee_id','manager_id','period_start','period_end','total_score','pass_threshold','feedback']));
		foreach ($request->get('items', []) as $item) {
			EvaluationItem::create([ 'evaluation_id' => $evaluation->id ] + $item);
		}
		return response()->json($evaluation->load('items'), 201);
	}

	public function summary(Request $request)
	{
		$from = Carbon::parse($request->get('from', now()->subMonths(3)))->toDateString();
		$to = Carbon::parse($request->get('to', now()))->toDateString();
		$rows = Evaluation::whereBetween('period_end', [$from, $to])->get(['total_score']);
		$avg = $rows->avg('total_score');
		$buckets = [
			['label' => 'Excellent (90-100)', 'count' => $rows->where('total_score','>=',90)->count()],
			['label' => 'Good (75-89)', 'count' => $rows->where('total_score','>=',75)->where('total_score','<',90)->count()],
			['label' => 'Needs Improvement (<75)', 'count' => $rows->where('total_score','<',75)->count()],
		];
		return response()->json(['buckets' => $buckets, 'avgScore' => $avg]);
	}
}