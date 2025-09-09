<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TurnoverRisk;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Evaluation;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
	public function turnoverRisk(Request $request)
	{
		$asOf = Carbon::parse($request->get('asOf', now()->toDateString()))->toDateString();
		$rows = TurnoverRisk::where('as_of_date', $asOf)->get(['probability']);
		$avg = $rows->avg('probability') ?? 0;
		$distribution = [
			['bucket' => '0-10%', 'count' => $rows->filter(fn($r) => $r->probability < 0.10)->count()],
			['bucket' => '10-30%', 'count' => $rows->filter(fn($r) => $r->probability >= 0.10 && $r->probability < 0.30)->count()],
			['bucket' => '>30%', 'count' => $rows->filter(fn($r) => $r->probability >= 0.30)->count()],
		];
		return response()->json(['asOf' => $asOf, 'avgRisk' => $avg, 'distribution' => $distribution]);
	}

	public function riskList(Request $request)
	{
		$asOf = Carbon::parse($request->get('asOf', now()->toDateString()))->toDateString();
		$min = (float)$request->get('min', 0.3);
		$rows = TurnoverRisk::with('employee.user')->where('as_of_date',$asOf)->where('probability','>=',$min)->orderByDesc('probability')->paginate(100);
		return response()->json($rows);
	}

	public function train(Request $request)
	{
		// Placeholder trainer: compute normalized risk from attendance absence rate and low evaluation scores
		$asOf = Carbon::parse($request->get('asOf', now()->toDateString()))->toDateString();
		TurnoverRisk::where('as_of_date',$asOf)->delete();
		$employees = Employee::all();
		foreach ($employees as $e) {
			$from = Carbon::parse($asOf)->subDays(90)->toDateString();
			$att = Attendance::where('employee_id',$e->id)->whereBetween('date',[$from,$asOf])->get();
			$days = max(1, $att->count());
			$absentRate = $att->where('status','absent')->count() / $days; // 0..1
			$perf = Evaluation::where('employee_id',$e->id)->where('period_end','<=',$asOf)->orderByDesc('period_end')->limit(3)->pluck('total_score');
			$avgScore = $perf->count() ? $perf->avg() : 80; // assume neutral
			$scoreRisk = max(0, (85 - $avgScore) / 85); // lower score => higher risk
			$prob = min(0.95, 0.5* $absentRate + 0.5* $scoreRisk);
			TurnoverRisk::create([
				'employee_id' => $e->id,
				'as_of_date' => $asOf,
				'probability' => $prob,
				'risk_level' => $prob >= 0.5 ? 'high' : ($prob >= 0.2 ? 'medium' : 'low'),
				'features_json' => [ 'absentRate90d' => $absentRate, 'avgScore' => $avgScore ],
			]);
		}
		return response()->json(['asOf'=>$asOf,'status'=>'trained']);
	}
}