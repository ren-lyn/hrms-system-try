<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evaluation;
use App\Models\EvaluationItem;
use App\Models\EvaluationSchedule;
use App\Models\EvaluationGoal;
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

	public function schedule(Request $request)
	{
		// HR schedules quarterly evaluations
		$scheduled = EvaluationSchedule::create($request->only(['employee_id','period_start','period_end','scheduled_at','status','created_by']));
		return response()->json($scheduled, 201);
	}

	public function approve(Request $request, $id)
	{
		// HR approves submitted evaluation
		$eval = Evaluation::findOrFail($id);
		$eval->status = 'approved';
		$eval->approved_by_employee_id = optional($request->user())->employee->id ?? null;
		$eval->approved_at = now();
		$eval->save();
		return response()->json($eval);
	}

	public function myEvaluations(Request $request)
	{
		$user = $request->user();
		$employeeId = optional($user->employee)->id;
		$rows = Evaluation::with('items')->where('employee_id', $employeeId)->orderByDesc('period_end')->paginate(20);
		return response()->json($rows);
	}

	public function goals(Request $request)
	{
		$user = $request->user();
		$employeeId = $request->get('employee_id') ?: optional($user->employee)->id;
		$q = EvaluationGoal::where('employee_id', $employeeId);
		return response()->json($q->orderByDesc('id')->paginate(50));
	}

	public function upsertGoal(Request $request)
	{
		$goal = EvaluationGoal::updateOrCreate(
			['id' => $request->get('id')],
			$request->only(['employee_id','title','description','status','weight','score','due_date'])
		);
		return response()->json($goal);
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