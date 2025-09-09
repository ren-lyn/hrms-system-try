<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PayrollItem;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Evaluation;
use Carbon\Carbon;

class ReportController extends Controller
{
	public function export(Request $request)
	{
		// TODO: dispatch job to create report and return job id
		return response()->json(['id' => uniqid('report_'), 'status' => 'enqueued'], 202);
	}

	public function csv(Request $request)
	{
		$type = $request->get('type'); // payroll|attendance|leave|performance
		$from = Carbon::parse($request->get('from', now()->startOfMonth()))->toDateString();
		$to = Carbon::parse($request->get('to', now()->endOfMonth()))->toDateString();
		$headers = [ 'Content-Type'=>'text/csv', 'Content-Disposition'=>"attachment; filename=report_${type}.csv" ];
		$callback = function() use ($type,$from,$to) {
			$out = fopen('php://output', 'w');
			if ($type === 'payroll') {
				fputcsv($out, ['Period Start','Gross','Net','Tax','Deductions']);
				$rows = PayrollItem::join('payroll_runs','payroll_runs.id','=','payroll_items.payroll_run_id')
					->whereBetween('payroll_runs.period_start', [$from,$to])
					->selectRaw('payroll_runs.period_start as date, sum(gross_pay) as gross, sum(net_pay) as net, sum(tax) as tax, sum(deductions_total) as deductions')
					->groupBy('payroll_runs.period_start')
					->orderBy('date')
					->get();
				foreach ($rows as $r) fputcsv($out, [$r->date,$r->gross,$r->net,$r->tax,$r->deductions]);
			} elseif ($type === 'attendance') {
				fputcsv($out, ['Date','Present','Absent']);
				$rows = Attendance::whereBetween('date',[$from,$to])
					->selectRaw('date, sum(case when status = "present" then 1 else 0 end) as present, sum(case when status = "absent" then 1 else 0 end) as absent')
					->groupBy('date')->orderBy('date')->get();
				foreach ($rows as $r) fputcsv($out, [$r->date,$r->present,$r->absent]);
			} elseif ($type === 'leave') {
				fputcsv($out, ['Employee','Type','Start','End','Status']);
				$rows = LeaveRequest::whereBetween('start_date',[$from,$to])->orderBy('start_date')->get();
				foreach ($rows as $r) fputcsv($out, [$r->employee_id,$r->type,$r->start_date,$r->end_date,$r->status]);
			} else {
				fputcsv($out, ['Employee','Period Start','Period End','Total Score','Status']);
				$rows = Evaluation::whereBetween('period_start',[$from,$to])->orderBy('period_start')->get();
				foreach ($rows as $r) fputcsv($out, [$r->employee_id,$r->period_start,$r->period_end,$r->total_score,$r->status]);
			}
			fclose($out);
		};
		return response()->stream($callback, 200, $headers);
	}
}