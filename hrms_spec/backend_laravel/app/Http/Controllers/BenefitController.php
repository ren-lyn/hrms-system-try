<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Benefit;
use App\Models\BenefitClaim;
use App\Models\BenefitContribution;
use App\Models\Employee;
use Carbon\Carbon;

class BenefitController extends Controller
{
	public function enroll(Request $request)
	{
		$benefit = Benefit::create($request->only(['employee_id','type','contribution','status']));
		return response()->json($benefit, 201);
	}

	public function indexClaims()
	{
		return response()->json(BenefitClaim::orderBy('created_at','desc')->paginate(50));
	}

	public function storeClaim(Request $request)
	{
		$claim = BenefitClaim::create($request->only(['employee_id','type','status','reason','document_url']));
		return response()->json($claim, 201);
	}

	public function approveClaim($id)
	{
		$claim = BenefitClaim::findOrFail($id);
		$claim->status = 'approved';
		$claim->save();
		return response()->json($claim);
	}

	public function rejectClaim($id, Request $request)
	{
		$claim = BenefitClaim::findOrFail($id);
		$claim->status = 'rejected';
		$claim->reason = $request->get('reason');
		$claim->save();
		return response()->json($claim);
	}

	public function terminateEnrollment($id)
	{
		$benefit = Benefit::findOrFail($id);
		$benefit->status = 'terminated';
		$benefit->save();
		return response()->json($benefit);
	}

	public function myBenefits(Request $request)
	{
		$user = $request->user();
		$employee = Employee::where('user_id',$user->id)->firstOrFail();
		$enrollments = Benefit::where('employee_id',$employee->id)->get();
		$claims = BenefitClaim::where('employee_id',$employee->id)->orderByDesc('id')->limit(50)->get();
		return response()->json(['enrollments'=>$enrollments,'claims'=>$claims]);
	}

	public function report(Request $request)
	{
		$from = Carbon::parse($request->get('from', now()->startOfMonth()))->toDateString();
		$to = Carbon::parse($request->get('to', now()->endOfMonth()))->toDateString();
		$rows = BenefitContribution::whereBetween('period_start', [$from,$to])
			->selectRaw('type, sum(amount) as total')
			->groupBy('type')
			->get();
		return response()->json(['period'=>['from'=>$from,'to'=>$to],'totals'=>$rows]);
	}
}