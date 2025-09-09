<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TurnoverRisk;
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
}