<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PayrollRun;
use App\Models\PayrollItem;
use App\Models\Employee;
use App\Models\EmployeeRecurringAllowance;
use App\Models\EmployeeRecurringDeduction;
use App\Models\EmployeeTaxTitle;
use App\Models\BenefitContribution;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{
	public function createRun(Request $request)
	{
		$this->requireRole($request, ['Admin','HR']);
		$run = PayrollRun::create($request->only(['period_start','period_end','status','created_by']));
		return response()->json($run, 201);
	}

	public function processRun(Request $request, $id)
	{
		$this->requireRole($request, ['Admin','HR']);
		$run = PayrollRun::findOrFail($id);
		$run->status = 'processing';
		$run->save();
		// Simplified synchronous compute (replace with queued job in production)
		DB::transaction(function() use ($run) {
			PayrollItem::where('payroll_run_id', $run->id)->delete();
			$employees = Employee::all();
			foreach ($employees as $e) {
				$base = $this->computeBasePay($e, $run->period_start, $run->period_end);
				$allowances = $this->sumAllowances($e);
				$deductions = $this->sumDeductions($e);
				$tax = $this->computeTax($e, $base + $allowances - $deductions);
				$gross = $base + $allowances;
				$net = $gross - ($tax + $deductions);
				PayrollItem::create([
					'payroll_run_id' => $run->id,
					'employee_id' => $e->id,
					'gross_pay' => round($gross, 2),
					'tax' => round($tax, 2),
					'deductions_total' => round($deductions, 2),
					'allowances_total' => round($allowances, 2),
					'net_pay' => round($net, 2),
					'details_json' => [
						'base' => $base,
						'period' => [$run->period_start, $run->period_end],
					]
				]);

				// Record benefit contributions (government types) for reporting
				$this->recordBenefitContributions($e, $run->period_start, $run->period_end);
			}
		});
		$run->status = 'finalized';
		$run->save();
		return response()->json(['status' => 'finalized']);
	}

	public function finalize(Request $request, $id)
	{
		$this->requireRole($request, ['Admin','HR']);
		$run = PayrollRun::findOrFail($id);
		$run->status = 'finalized';
		$run->save();
		return response()->json($run);
	}

	public function markPaid(Request $request, $id)
	{
		$this->requireRole($request, ['Admin','HR']);
		$run = PayrollRun::findOrFail($id);
		$run->status = 'paid';
		$run->save();
		return response()->json($run);
	}

	public function items($id)
	{
		$items = PayrollItem::where('payroll_run_id', $id)->with('employee')->paginate(100);
		return response()->json($items);
	}

	public function myPayslips(Request $request)
	{
		$user = $request->user();
		$employee = Employee::where('user_id', $user->id)->firstOrFail();
		$items = PayrollItem::where('employee_id', $employee->id)
			->with('run')
			->orderByDesc('id')
			->paginate(50);
		return response()->json($items);
	}

	public function updateSalary(Request $request, $employeeId)
	{
		$this->requireRole($request, ['Admin','HR']);
		$employee = Employee::findOrFail($employeeId);
		$employee->base_hourly_rate = $request->input('base_hourly_rate');
		$employee->save();
		return response()->json($employee);
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

	private function requireRole(Request $request, array $roles)
	{
		$user = $request->user();
		if (!$user || !in_array($user->role, $roles)) {
			abort(403, 'Forbidden');
		}
	}

	private function computeBasePay(Employee $e, $from, $to): float
	{
		// Weekly: hourly rate * 40 by default (replace with attendance-based computation if available)
		$hours = 40.0;
		return (float)$e->base_hourly_rate * $hours;
	}

	private function sumAllowances(Employee $e): float
	{
		$rows = EmployeeRecurringAllowance::where('employee_id', $e->id)->get();
		$total = 0.0;
		foreach ($rows as $r) {
			$total += (float)$r->amount;
		}
		return $total;
	}

	private function sumDeductions(Employee $e): float
	{
		$rows = EmployeeRecurringDeduction::where('employee_id', $e->id)->get();
		$total = 0.0;
		foreach ($rows as $r) {
			$total += (float)$r->amount;
		}
		return $total;
	}

	private function computeTax(Employee $e, float $taxable): float
	{
		$taxTitle = EmployeeTaxTitle::where('employee_id', $e->id)->orderByDesc('effective_date')->first();
		$rate = $taxTitle ? (float)optional($taxTitle->taxTitle)->rate_percent : 0.0;
		return $taxable * ($rate / 100.0);
	}

	private function recordBenefitContributions(Employee $e, string $from, string $to): void
	{
		$govTypes = ['sss','phic','pagibig'];
		$rows = \App\Models\Benefit::where('employee_id',$e->id)
			->whereIn('type', $govTypes)
			->where('status','active')
			->get();
		foreach ($rows as $b) {
			BenefitContribution::create([
				'employee_id' => $e->id,
				'period_start' => $from,
				'period_end' => $to,
				'type' => $b->type,
				'amount' => (float)$b->contribution,
				'source' => 'payroll',
			]);
		}
	}
}